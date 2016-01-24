'use strict';
var express = require('express');
var router = express.Router();
var utils = require('./utils');


router.get('/about', function (req, res, next) {
    res.render('about', {
        title: 'About',
    });
});


router.get('/', function (req, res, next) {
     utils.loadIndexJSON().then(function(index) {
        res.render('index', {
            title: 'Top',
            index: index
        });
    }).catch(function(err) {
        next(err);
    });
});

module.exports = router;
