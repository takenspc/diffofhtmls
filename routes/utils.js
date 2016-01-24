'use strict';
var fs = require('fs');
var path = require('path');
var diff = require('diff');


function computeDiff(a, b) {
    var rawDiffs = diff.diffLines(a, b, {
        newlineIsToken: true
    });
    
    var diffItems = [];
    for (var i = 0, diffItem; i < rawDiffs.length; i++) {
        var rawDiff = rawDiffs[i];
        if (rawDiff.removed) {
            diffItem = {
                a: rawDiff.value,
                b: null,
            };
        } else if (rawDiff.added) {
            diffItem.b = rawDiff.value;
            diffItems.push(diffItem);
        } else {
            diffItem = {
                a: rawDiff.value,
                b: rawDiff.value
            };
            diffItems.push(diffItem);
        }
    }
    return diffItems;
}

function findSection(htmlPath) {
    return loadIndexJSON().then(function (index) {
        for (var i = 0; i < index.length; i++) {
            var sections = index[i].sections;
            if (!sections) {
                continue;
            }
            
            for (var j = 0; j < sections.length; j++) {
                if (sections[j].htmlPath === htmlPath) {
                    var section = sections[j];
                    // TODO
                    section.parent = index[i];

                    return section;
                }
            }
        }

        return null;
    });
}

function loadSectionHTML(org, htmlPath) {
    return new Promise(function (resolve, reject) {
        console.log(org, htmlPath);
        var sectionPath = path.join(__dirname, '..', 'data', org, htmlPath);
        fs.readFile(sectionPath, 'utf-8', function (err, html) {
            if (err) {
                // No such file
                if (err.code === 'ENOENT') {
                    resolve('');
                    return;
                }

                reject(err);
                return;
            }

            resolve(html);
        });
    });
}

function loadIndexJSON() {
    var jsonPath = path.join(__dirname, '..', 'data', 'index.json');
    return loadJSON(jsonPath);
}

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

module.exports = {
    loadIndexJSON: loadIndexJSON,
    findSection: findSection,
    loadSectionHTML: loadSectionHTML,
    computeDiff: computeDiff,
}
