const express = require('express');
const router = express.Router();
const utils = require('./utils/firebase');
const links = require('./utils/links');

function loadUpdates() {
    return Promise.all([
        utils.loadIndexJSON(true),
        utils.loadUpdates()
    ]).then(([index, updates]) => {
        for (const update of updates) {
            if (!update.updated) {
                continue;
            }

            for (const updateEntry of  update.updated) {
                updateEntry.section = links.findSection(index, updateEntry.path);
            }
        }
        return updates;
    });
}

router.get('/atom', (req, res, next) => {
    loadUpdates().then((updates) => {
        res.set('Content-Type', 'application/atom+xml');
        res.render('log_atom', {
            updates: updates
        });
    }).catch((err) => {
        next(err);
    });
});


router.get('/', (req, res, next) => {
    loadUpdates().then((updates) => {
        res.render('log', {
            title: 'Update information',
            updates: updates
        });
    }).catch((err) => {
        next(err);
    });
});

module.exports = router;
