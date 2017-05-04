const express = require('express');
const router = express.Router();
const utils = require('./utils/firebase');


router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About this site'
    });
});


router.get('/', (req, res, next) => {
    Promise.all([
        utils.loadIndexJSON(false),
        utils.loadFetchJSON()
    ]).then(([index, time]) => {
        res.render('index', {
            title: 'Top',
            time: time,
            index: index
        });
    }).catch((err) => {
        next(err);
    });
});

module.exports = router;
