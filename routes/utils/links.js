'use strict';

//
// Create Link
//
function* nextSection(parent, sections) {
    for (var i = 0, len = sections.length; i < len; i++) {
        var section = sections[i];

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
    var previousSection = null;
    for (var section of nextSection(null, sections)) {

        section.previous = previousSection;
        section.next = null;

        if (previousSection) {
            previousSection.next = section;
        }

        previousSection = section;
    }
}


function findSection(sections, sectionPath) {
    for (var i = 0, len = sections.length; i < len; i++) {
        var section = sections[i];
        if (section.path === sectionPath) {
            return section;
        }

        var child = findSection(section.sections, sectionPath);
        if (child) {
            return child;
        }
    }

    return null;
}

module.exports = {
    createLinkForIndexJSON: createLinkForIndexJSON,
    findSection: findSection,
};
