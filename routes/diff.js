const express = require('express');
const router = express.Router();
const utils = require('./utils/firebase');


router.get(/^\/(.+)$/, (req, res, next) => {
    const sectionPath = req.params[0];

    Promise.all([
        utils.loadDiff(sectionPath),
        utils.loadFetchJSON()
    ]).then(([{ section, diffs }, time]) => {
        // XXX
        const topics = [];
        const titles = [];
        for (let node = section; node; node = node.parent) {
            topics.unshift(node.headingText);
            titles.push(node.headingText);
        }

        res.render('diff', {
            title: 'Diff of ' + titles.join(' ← '),
            time: time,

            section: section,
            topicPath: topics.join(' → '),
            previousSection: section.previous,
            nextSection: section.next,

            diffs: diffs
        });
    }).catch((err) => {
        next(err);
    });
});

module.exports = router;
