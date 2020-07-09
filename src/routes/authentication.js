const express = require('express');
const router = express.Router();

const passport = require('passport'); // importo passport.js
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth'); // importo el metodo

// SIGNUP
router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

// recibir datos del form 
router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

// SINGIN
router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    /*req.check('username', 'Username is Required').notEmpty();
    req.check('password', 'Password is Required').notEmpty();
    const errors = req.validationErrors();
    if (errors.length > 0) {
      req.flash('message', errors[0].msg);
      res.redirect('/signin');
    }*/
    passport.authenticate('local.signin', {
      successRedirect: '/profile',
      failureRedirect: '/signin',
      failureFlash: true
    })(req, res, next); //debo pasarle los objetos
  });

// protejo la vista ejecutando isLoggedIn
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

// limpia la sesion con metodos de modulo passport
router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;