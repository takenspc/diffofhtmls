'use strict';
var path = require('path');
var express = require('express');
var router = express.Router();
var utils = require('./utils/firebase');


router.get('/about', function (req, res, next) {
    res.render('about', {
        title: 'About this site',
    });
});


router.get('/', function (req, res, next) {
    Promise.all([
        utils.loadIndexJSON(),
        utils.loadFetchJSON(),
    ]).then(function (data) {
        var index = data[0];
        var time = data[1];

        res.render('index', {
            title: 'Top',
            time: time,
            index: index,
        });
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;
