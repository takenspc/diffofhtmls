var express = require('express');
var router = express.Router();
var utils = require('./utils/firebase');
var links = require('./utils/links');


router.get('/atom', (req, res, next) => {
    utils.loadUpdates().then((updates) => {
        res.set('Content-Type', 'application/atom+xml');
        res.render('log_atom', {
            updates: updates
        });
    }).catch((err) => {
        next(err);
    });
});


router.get('/', (req, res, next) => {
    Promise.all([
        utils.loadIndexJSON(true),
        utils.loadUpdates()
    ]).then(([index, updates]) => {
        for (const update of updates) {
            if (!update.updated) {
                continue;
            }

            for (const updated of  update.updated) {
                updated.section = links.findSection(index, updated.path);
            }
        }
        
        res.render('log', {
            title: 'Update information',
            updates: updates
        });
    }).catch((err) => {
        next(err);
    });
});

module.exports = router;
