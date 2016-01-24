'use strict';
var path = require('path');
var express = require('express');
var router = express.Router();
var utils = require('./utils');

router.param('chapter', function (req, res, next, chapter) {
    req.chapter = chapter;
    
    // TODO ensure chapter exists
    next();
});

router.param('section', function (req, res, next, section) {
    req.section = section;
    
    // TODO ensure section exists
    next();
});

router.get('/:chapter/:section', function (req, res, next) {
    var chapterPath = req.chapter;
    var sectionPath = req.section;
    var htmlPath = chapterPath + '/' + sectionPath;

    utils.findSection(htmlPath).then(function (section) {
        if (!section || (!section.whatwg && !section.w3c)) {
            var err = new Error('There are no such section');
            next(err);
            return;
        }

        Promise.all([
            utils.loadSectionHTML('whatwg', htmlPath),
            utils.loadSectionHTML('w3c', htmlPath),
        ]).then(function (data) {
            var whatwg = data[0];
            var w3c = data[1];
            
            var diffs = utils.computeDiff(whatwg, w3c);

            res.render('diff', {
                title: 'Diff of ' + section.heading + ' | ' + section.parent.heading,
                section: section,
                diffs: diffs,
            });
        }).catch(function (err) {
           next(err);
        });
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;
