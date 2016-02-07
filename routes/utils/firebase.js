'use strict';
var firebase = require('firebase');
var links = require('./links');

//
// Firebase
//
var URL = process.env.FIREBASE_URL || null;
var AUTH_TOKEN = process.env.FIREBASE_AUTH_TOKEN || null;
var FIREBASE_REF = new Firebase(URL);
if (URL && AUTH_TOKEN) {
    FIREBASE_REF.authWithCustomToken(AUTH_TOKEN, function (err) {
        if (err) {
            console.log('can not connect firebase');
            throw new Error(err);
        }
        console.log('connected to Firebase');
    });
}


//
// Utils
//
function getValue(firebaseRef) {
    return new Promise((resolve, reject) => {
        firebaseRef.once('value', function (dataSnapshot) {
            resolve(dataSnapshot.val());
        }, function (err) {
            reject(err);
        });
    });
}

function getLastValue(firebaseRef) {
    return new Promise((resolve, reject) => {
        var query = firebaseRef.limitToLast(1);
        query.once('value', function (dataSnapshot) {
            // check number of children
            var numChildren = dataSnapshot.numChildren();
            if (numChildren !== 1) {
                reject(new Error('Unexpected number of children: ' + numChildren));
                return;
            }

            var val;
            dataSnapshot.forEach(function(childSnapshot) {
                val = childSnapshot.val();
            });

            resolve(val);
        }, function (err) {
            reject(err);
        });
    });
}


//
// Index
//
function loadIndexJSON() {
    var indexRef = FIREBASE_REF.child('index');
    return getValue(indexRef).then((sections) => {
        links.createLinkForIndexJSON(sections, null)
        return sections;
    });
}


//
// Diff
//
function loadDiff(sectionPath) {
    // TODO skip loadIndexJSON here
    return loadIndexJSON().then(function (sections) {
        var section = links.findSection(sections, sectionPath);
        if (!section) {
            Promise.reject(new Error('No such section: ' + sectionPath));
        }

        var diffRef = FIREBASE_REF.child('diff');
        var sectionRef = diffRef.child(sectionPath);
        return getValue(sectionRef).then(function (diffs) {
            return {
                section: section,
                diffs: diffs
            };
        });
    });
}


//
// Fetch
//
function loadFetchJSON() {
    var updateRef = FIREBASE_REF.child('update');
    return getLastValue(updateRef).then((value) => {
        return value.datetime;
    });
}


//
// Update
//
function loadUpdateEntries() {
    var updateRef = FIREBASE_REF.child('update');
    return new Promise(function(resolve, reject) {
        var query = updateRef.limitToLast(14);
        query.once('value', function (dataSnapshot) {
            var entries = [];

            // TODO
            dataSnapshot.forEach(function(childSnapshot) {
                var val = childSnapshot.val();
                entries.push(val);
            });

            resolve(entries.reverse());
        }, function (err) {
            reject(err);
        });
    });
}

module.exports = {
    loadDiff: loadDiff,
    loadFetchJSON: loadFetchJSON,
    loadIndexJSON: loadIndexJSON,
    loadUpdates: loadUpdateEntries,
};
