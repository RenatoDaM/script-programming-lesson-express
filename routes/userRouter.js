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


router.post('/login', async (req, res, next) => {
    var username = req.body.emailejs;
    var password = req.body.senhaejs;
    console.log(username)
    console.log(password)
    debugger
    if (!username || !password) {
        return res.render('index', { msg: 'Insira email e senha!' });
    }

    try {
        const user = await User.findOne({ where: { username } });
        if (!user || !(await user.comparePassword(password))) {
            return res.render('index', { msg: 'Email ou senha incorretos!' });
        }
        req.session.userId = user.id;
        res.redirect('../customers');
    } catch (error) {
        next(error);
    }
});

router.get('/logout', function(request, response, next){
    request.session.destroy();
    response.redirect("/");
});

module.exports = router;