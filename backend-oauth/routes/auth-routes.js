const router = require('express').Router();
const passport = require('passport');
const env = require('../config/env');
const config = require('../config/env')
const redis = require('redis');
const client = redis.createClient({url: `redis://${config.REDIS_ADDR}`});

router.get('/logout', (req, res) => {
  client.del(req.user.id)
  req.logout();
  res.end();
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile'],
    prompt : "select_account"
  })
);

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  console.log(req.url);
  res.redirect(env.FRONTEND_ADDR);
});

module.exports = router;
