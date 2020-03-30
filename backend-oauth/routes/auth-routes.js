const router = require('express').Router();
const passport = require('passport');
const env = require('../config/env');

router.get('/logout', (req, res) => {
  req.logout();
  res.end();
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile'],
  })
);

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  console.log(req.url);
  res.redirect(env.FRONTEND_ADDR);
});

module.exports = router;
