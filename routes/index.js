'use strict';
var path = require('path');
var express = require('express');
var router = express.Router();
var utils = require('./utils');


router.get('/about', function (req, res, next) {
    res.render('about', {
        title: 'About',
    });
});


router.get('/', function (req, res, next) {
    var fetchJSONPath = path.join(__dirname, '..', 'data', 'fetch.json');

    Promise.all([
        utils.loadIndexJSON(),
        utils.loadJSON(fetchJSONPath),
    ]).then(function (data) {
        var index = data[0];
        var time = data[1].time;

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
