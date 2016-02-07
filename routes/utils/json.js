'use strict';
var fs = require('fs');
var path = require('path');
var links = require('./links');

const dataRoot = path.join(__dirname, '..', '..', 'data');

//
// Utils
//
function loadJSON(jsonPath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(jsonPath, 'utf-8', function (err, str) {
            if (err) {
                reject(err);
                return;
            }

            var data = JSON.parse(str);
            resolve(data);
        });
    });
}


//
// Index
//
function loadIndexJSON() {
    var jsonPath = path.join(dataRoot, 'index.json');
    return loadJSON(jsonPath).then(function (sections) {
        links.createLinkForIndexJSON(sections, null);
        return sections;
    });
}


//
// Diff
//
function loadDiff(sectionPath) {
    return loadIndexJSON().then(function (sections) {
        var section = links.findSection(sections, sectionPath);
        if (!section) {
            Promise.reject(new Error('No such section: ' + sectionPath));
        }

        var jsonPath = path.join(dataRoot, section.path + '.json');
        return loadJSON(jsonPath).then(function (diffs) {
            return {
                section: section,
                diffs: diffs,
            };
        });
    });
}


//
// Fetch
//
function loadFetchJSON() {
    var fetchJSONPath = path.join(dataRoot, 'fetch.json');
    return loadJSON(fetchJSONPath).then(function (fetchData) {
        return fetchData.time;
    });
}


module.exports = {
    loadDiff: loadDiff,
    loadFetchJSON: loadFetchJSON,
    loadIndexJSON: loadIndexJSON,
};
