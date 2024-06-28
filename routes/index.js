var express = require('express');
var router = express.Router();
var database = require('../database')
var { User, Customer, Pet } = require('../database');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'My Pet Pal', session: req.session, msg: ''});
});

module.exports = router;
