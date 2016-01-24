'use strict';
var diff = require('diff');

function splitDiffIntoLines(rawDiffs) {

    var line = { a: [], b: [] };
    var lines = [line];

    for (var i = 0; i < rawDiffs.length; i++) {
        var rawDiff = rawDiffs[i];

        var values = rawDiff.value.split('\n');

        for (var j = 0; j < values.length; j++) {
            if (j > 0) {
                line = { a: [], b: [] };
                lines.push(line);
            }

            var hunk = {
                value: values[j],
                added: rawDiff.added,
                removed: rawDiff.removed,
            };

            if (hunk.removed || (!hunk.added && !hunk.removed)) {
                line.a.push(hunk);
            }

            if (hunk.added || (!hunk.added && !hunk.removed)) {
                line.b.push(hunk);
            }
        }
        
    }
    
    return lines;
}

function computeDiff(a, b) {
    var rawDiffs = diff.diffChars(a, b, {
        newlineIsToken: true
    });

    var lines = splitDiffIntoLines(rawDiffs);

    return lines;
}

module.exports = {
    computeDiff: computeDiff,
}
