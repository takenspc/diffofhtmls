/**
 * @typedef {Object} DiffStat
 * @property {number} total
 * @property {number} diffCount
 */

/**
 * @typedef {Object} HashInfo
 * @property {string} splitted
 * @property {string} formatted
 */

/**
 * @typedef {Object} FlattedSpecSection
 * @property {string} id
 * @property {string} originalHeadingText
 * @property {HashInfo} hash
 * @property {DiffStat} diffStat: DiffStat

 */

/**
 * @typedef {Object} UnifiedSection
 * @class
 * @property {string} path
 * @property {string} headingText
 * @property {string}originalHeadingText
 * @property {UnifiedSection[]} sections
 * @property {JSONEntry} FlattedSpecSection
 * @property {JSONEntry} FlattedSpecSection
 * @property {UnifiedSection} parent
 * @property {UnifiedSection} previous
 * @property {UnifiedSection} next
 */

/**
 * @typedef {Object} Diff
 * @property {string} value
 * @property {boolean} added
 * @property {boolean} removed
 */

/**
 * @typedef {object} SectionAndDiff
 * @property {Section} section
 * @property {Diff[]} diffs
 */

/**
 * @typedef {Object} UpdateSubEntry
 * @property {string} splitted
 * @property {string} formatted
 * @property {string} diffStat
 */

/**
 * @typedef {Object} UpdateEntry
 * @property {string} path
 * @property {string} headingText
 * @property {UpdateSubEntry} whatwg
 * @property {UpdateSubEntry} w3c
 */

//
// Create Link
//
/**
 * @private
 * @param {Section} parent
 * @param {Section[]} sections
 * @returns {Iterable<Section>}
 */
function* nextSection(parent, sections) {
    for (const section of sections) {
        // create link here too
        section.parent = parent;

        // section.sections must be always array
        if (!section.sections) {
            section.sections = [];
        }

        if (section.sections.length === 0) {
            yield section;
        } else {
            yield* nextSection(section, section.sections);
        }
    }
}


/**
 * @param {Section[]} sections
 * @returns {void}
 */
function createLinkForIndexJSON(sections) {
    let previousSection = null;
    for (const section of nextSection(null, sections)) {

        section.previous = previousSection;
        section.next = null;

        if (previousSection) {
            previousSection.next = section;
        }

        previousSection = section;
    }
}


/**
 * @param {Section[]} sections
 * @param {string} sectionPath
 * @returns {Section}
 */
function findSection(sections, sectionPath) {
    for (const section of sections) {
        if (section.path === sectionPath) {
            return section;
        }

        const child = findSection(section.sections, sectionPath);
        if (child) {
            return child;
        }
    }

    return null;
}

module.exports = {
    createLinkForIndexJSON: createLinkForIndexJSON,
    findSection: findSection
};
