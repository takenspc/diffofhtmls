var fs = require('fs');
var path = require('path');
var links = require('./links');

const dataRoot = path.join(__dirname, '..', '..', 'data');

//
// Utils
//
/**
 * @private
 * @param {string} jsonPath
 * @returns {Promise<any>}
 */
function loadJSON(jsonPath) {
    return new Promise((resolve, reject) => {
        fs.readFile(jsonPath, 'utf-8', (err, str) => {
            if (err) {
                reject(err);
                return;
            }

            const data = JSON.parse(str);
            resolve(data);
        });
    });
}


//
// Index
//
/**
 * @returns {Promise<Section[]>}
 */
function loadIndexJSON() {
    const jsonPath = path.join(dataRoot, 'index.json');
    return loadJSON(jsonPath).then((sections) => {
        links.createLinkForIndexJSON(sections, null);
        return sections;
    });
}


//
// Diff
//
/**
 * @param {string} sectionPath
 * @returns {Promise<SectionAndDiff>}
 */
function loadDiff(sectionPath) {
    return loadIndexJSON().then((sections) => {
        const section = links.findSection(sections, sectionPath);
        if (!section) {
            Promise.reject(new Error('No such section: ' + sectionPath));
        }

        const jsonPath = path.join(dataRoot, section.path + '.json');
        return loadJSON(jsonPath).then((diffs) => {
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
/**
 * @returns {Promise<number>}
 */
function loadFetchJSON() {
    const fetchJSONPath = path.join(dataRoot, 'fetch.json');
    return loadJSON(fetchJSONPath).then((fetchData) => {
        return fetchData.time;
    });
}


module.exports = {
    loadDiff: loadDiff,
    loadFetchJSON: loadFetchJSON,
    loadIndexJSON: loadIndexJSON
};
