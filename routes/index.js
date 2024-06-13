var express = require('express');
var router = express.Router();
var database = require('../database')
var { User, Customer, Pet } = require('../database');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'My Pet Pal', session: req.session, msg: ''});
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
        res.redirect('sample_data/customers');
    } catch (error) {
        next(error);
    }
});

router.get('/logout', function(request, response, next){
    request.session.destroy();
    response.redirect("/");
});

module.exports = router;
