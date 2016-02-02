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


//
// Create Link
//
function* nextSection(parent, sections) {
    for (var i = 0, len = sections.length; i < len; i++) {
        var section = sections[i];

        // create link here too
        section.parent = parent;

        if (section.sections.length === 0) {
            yield section;
        } else {
            yield* nextSection(section, section.sections);
        }
    }
}

function fixID(section) {
    if (section.whatwg && section.whatwg.id === '__pre__') {
        section.whatwg.id = section.parent.whatwg.id;
    }
    if (section.w3c && section.w3c.id === '__pre__') {
        section.w3c.id = section.parent.w3c.id;
    }
}

function createLinkForIndexJSON(sections) {
    var previousSection = null;
    for (var section of nextSection(null, sections)) {
        fixID(section);

        section.previous = previousSection;
        section.next = null;

        if (previousSection) {
            previousSection.next = section;
        }

        previousSection = section;
    }
}

function loadIndexJSON() {
    var jsonPath = path.join(__dirname, '..', 'data', 'index.json');
    return loadJSON(jsonPath).then(function (sections) {
        createLinkForIndexJSON(sections, null)
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
