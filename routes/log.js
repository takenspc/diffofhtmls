'use strict';
var path = require('path');
var express = require('express');
var router = express.Router();
var utils = require('./utils/firebase');


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
    utils.loadUpdates().then(function (updates) {
        res.render('log', {
            title: 'Update information',
            updates: updates,
        });
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;