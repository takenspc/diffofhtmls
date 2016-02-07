'use strict';
var path = require('path');
var express = require('express');
var router = express.Router();
var utils = require('./utils/firebase');


router.get(/^\/(.+)$/, function (req, res, next) {
    var sectionPath = req.param(0);

    Promise.all([
        utils.loadDiff(sectionPath),
        utils.loadFetchJSON(),
    ]).then(function (data) {
        var obj = data[0];
        var section = obj.section;
        var diffs = obj.diffs;

        var time = data[1];

        // XXX
        var topics = [];
        var titles = [];
        for (var node = section; node; node = node.parent) {
            topics.unshift(node.headingText);
            titles.push(node.headingText);
        }

        res.render('diff', {
            title: 'Diff of ' + titles.join(' | '),
            time: time,

            section: section,
            topicPath: topics.join(' → '),
            previousSection: section.previous,
            nextSection: section.next,

            diffs: diffs,
        });
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;
