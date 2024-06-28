var express = require('express');
var router = express.Router();
var {User} = require('../database')

router.get("/", function(request, response, next){
    response.render("newuser", { msg: '' });
});

router.post("/", async function(request, response, next){
    var email = request.body.emailejs;
    var password = request.body.senhaejs;

    if (email === '' || password === '') {
        response.render('newuser', { msg: 'Missing required entries' });
    } else {
        try {
            await User.create({
                username: email,
                password: password
            });
            response.render('index', { msg: 'New user created!' });
        } catch (error) {
            next(error);
        }
    }
});


module.exports = router;