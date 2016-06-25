'use strict';

//
// Create Link
//
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
