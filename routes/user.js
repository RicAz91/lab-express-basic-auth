'use strict';

const { Router } = require('express');
const router = Router();
const routeGuard = require('./../middleware/route-guard');
const User = require('./../models/user');

router.get('/:user', routeGuard, (req, res, next) => {
  const user = req.params.user;
  User.findOne({ username: user })
    .then(data => {
      console.log(data);
      res.render('profile/view', { data });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:user/edit', routeGuard, (req, res, next) => {
  const user = req.params.user;
  User.findOne({ username: user })
    .then(data => {
      console.log(data);
      res.render('profile/edit', { data });
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:user/edit', routeGuard, (req, res, next) => {
  const { email, password, username } = req.body;

  bcryptjs
    .hash(password, 10)
    .then(hashPlusSalt => {
      return User.updateOne({
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
module.exports = router;
