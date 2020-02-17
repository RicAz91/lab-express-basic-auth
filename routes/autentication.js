'use strict';

const { Router } = require('express');
const router = Router();

const bcryptjs = require('bcryptjs');

const User = require('./../models/user');

router.get('/signup', (req, res, next) => {
  res.render('autentication/signup');
});

router.post('/signup', (req, res, next) => {
  const { email, password, username } = req.body;
  console.log('sucess', req.body);

  bcryptjs
    .hash(password, 10)
    .then(hashPlusSalt => {
      return User.create({
        email,
        username,
        passwordHash: hashPlusSalt
      });
    })
    .then(user => {
      req.session.userId = user._id;
      res.redirect('/');
    })
    .catch(error => {
      next(error);
    });
});

router.get('/signin', (req, res, next) => {
  res.render('autentication/signin');
});

router.post('/signin', (req, res, next) => {
  const { email, password } = req.body;

  let user;

  User.findOne({ email })
    .then(document => {
      if (!document) {
        next(new Error('USER_NOT_FOUND'));
      } else {
        user = document;
        return bcryptjs.compare(password, document.passwordHash);
      }
    })
    .then(match => {
      if (match) {
        req.session.userId = user._id;
        res.redirect('/');
      } else {
        next(new Error('USER_PASSWORD_WRONG'));
      }
    })
    .catch(error => {
      next(error);
    });
});

router.post('/signout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
