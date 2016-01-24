'use strict';
var fs = require('fs');
var path = require('path');

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
}
