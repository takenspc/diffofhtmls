'use strict';
var fs = require('fs');
var path = require('path');

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


function createParentLinkForIndexJSON(sections, parent) {
    for (var i = 0, len = sections.length; i < len; i++) {
        var section = sections[i];
        section.parent = parent;

        createParentLinkForIndexJSON(section.sections, section);
    }
}

function loadIndexJSON() {
    var jsonPath = path.join(__dirname, '..', 'data', 'index.json');
    return loadJSON(jsonPath).then(function (sections) {
        createParentLinkForIndexJSON(sections, null)
        return sections;
    });
}


function findSectionInternal(sections, sectionPath) {
    for (var i = 0, len = sections.length; i < len; i++) {
        var section = sections[i];
        if (section.path === sectionPath) {
            return section;
        }

        var child = findSectionInternal(section.sections, sectionPath);
        if (child) {
            return child;
        }
    }

    return null;
}

function findSection(sectionPath) {
    return loadIndexJSON().then(function (sections) {
        var section =  findSectionInternal(sections, sectionPath);
        if (section) {
            return section;
        }

        return Promise.reject(new Error('No such section'));
    });
}


function loadDiff(section) {
    var jsonPath = path.join(__dirname, '..', 'data', section.path + '.json');
    return loadJSON(jsonPath).then(function (diffs) {
        return {
            section: section,
            diffs: diffs,
        };
    });
}


module.exports = {
    loadJSON: loadJSON,
    loadIndexJSON: loadIndexJSON,
    findSection: findSection,
    loadDiff: loadDiff,
};
