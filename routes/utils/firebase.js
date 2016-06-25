/* globals Firebase */
var firebase = require('firebase');
var links = require('./links');

//
// Firebase
//
const URL = process.env.FIREBASE_URL || null;
const AUTH_TOKEN = process.env.FIREBASE_AUTH_TOKEN || null;
const FIREBASE_REF = new Firebase(URL);
if (URL && AUTH_TOKEN) {
    FIREBASE_REF.authWithCustomToken(AUTH_TOKEN, (err) => {
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
    return firebaseRef.once('value').then((dataSnapshot) => {
        return dataSnapshot.val();
    });
}

function getLastValue(firebaseRef) {
    const query = firebaseRef.limitToLast(1);
    return query.once('value').then((dataSnapshot) => {
        // check number of children
        const numChildren = dataSnapshot.numChildren();
        if (numChildren !== 1) {
            return Promise.reject(new Error(`Unexpected number of children: ${numChildren}`));
        }

        // XXX val = dataSnapshot.val()[0]?
        let val;
        dataSnapshot.forEach((childSnapshot) => {
            val = childSnapshot.val();
        });

        return val;
    });
}


//
// Index
//
function loadIndexJSON() {
    const indexRef = FIREBASE_REF.child('index');
    return getValue(indexRef).then((sections) => {
        links.createLinkForIndexJSON(sections, null);
        return sections;
    });
}


//
// Diff
//
function loadDiff(sectionPath) {
    // TODO skip loadIndexJSON here
    return loadIndexJSON().then((sections) => {
        const section = links.findSection(sections, sectionPath);
        if (!section) {
            Promise.reject(new Error(`No such section: ${sectionPath}`));
        }

        const diffRef = FIREBASE_REF.child('diff');
        const sectionRef = diffRef.child(sectionPath);
        return getValue(sectionRef).then((diffs) => {
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
    const updateRef = FIREBASE_REF.child('update');
    return getLastValue(updateRef).then((value) => {
        return value.datetime;
    });
}


//
// Update
//
function loadUpdateEntries() {
    const updateRef = FIREBASE_REF.child('update');
    return new Promise((resolve, reject) => {
        const query = updateRef.limitToLast(14);
        query.once('value', (dataSnapshot) => {
            const entries = [];

            // TODO
            dataSnapshot.forEach((childSnapshot) => {
                const val = childSnapshot.val();
                entries.push(val);
            });

            resolve(entries.reverse());
        }, (err) => {
            reject(err);
        });
    });
}

module.exports = {
    loadDiff: loadDiff,
    loadFetchJSON: loadFetchJSON,
    loadIndexJSON: loadIndexJSON,
    loadUpdates: loadUpdateEntries
};
