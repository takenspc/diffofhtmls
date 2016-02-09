'use strict';
var path = require('path');
var express = require('express');
var router = express.Router();
var utils = require('./utils/firebase');
var links = require('./utils/links');


router.get('/atom', function (req, res, next) {
    utils.loadUpdates().then(function (updates) {
        res.set('Content-Type', 'application/atom+xml');
        res.render('log_atom', {
            updates: updates,
        });
    }).catch(function (err) {
        next(err);
    });
});


router.get('/', function (req, res, next) {
    Promise.all([
        utils.loadIndexJSON(),
        utils.loadUpdates(),
    ]).then(function (data) {
        var index = data[0];
        var updates = data[1];
        
        // XXX 
        for (var i = 0; i < updates.length; i++) {
            var update = updates[i];
            if (!update.updated) {
                continue;
            }

            for (var j = 0; j < update.updated.length; j++) {
                var updated = update.updated[j];
                updated.section = links.findSection(index, updated.path);
            }
        }
        
        res.render('log', {
            title: 'Update information',
            updates: updates,
        });
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;
