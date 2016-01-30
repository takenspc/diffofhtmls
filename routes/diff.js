'use strict';
var path = require('path');
var express = require('express');
var router = express.Router();
var utils = require('./utils');

function formatPreface(section, parent) {
    if (section && section.heading === '__pre__') {
        section.heading = '(preface)';
        if (parent) {
            section.id = parent.id;
        }
    }
}

router.get(/^\/(.+)$/, function (req, res, next) {
    var sectionPath = req.param(0);
    console.log(sectionPath);

    utils.findSection(sectionPath).then(function (section) {
        return utils.loadDiff(section);
    }).then(function (obj) {
        var section = obj.section;
        var diffs = obj.diffs;

        // XXX
        formatPreface(section, null);
        formatPreface(section.whatwg, section.parent.whatwg);
        formatPreface(section.w3c, section.parent.w3c);

        // XXX
        var topics = [];
        var titles = [];
        for (var node = section; node; node = node.parent) {
            topics.unshift(node.heading);
            titles.push(node.heading);
        }

        res.render('diff', {
            title: 'Diff of ' + titles.join(' | '),
            section: section,
            diffs: diffs,
            topicPath: topics.join(' → '),
        });
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;
