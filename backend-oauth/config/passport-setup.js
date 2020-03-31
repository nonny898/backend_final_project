const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const redis = require('redis');
const config = require('../config/env')

const client = redis.createClient({url: `redis://${config.REDIS_ADDR}`});

const keys = require('./keys');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  client.get(id, (err, reply) => {
    done(null, JSON.parse(reply));
  });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/redirect',
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      client.get(profile.id, (err, reply) => {
        if (reply) {
          done(null, JSON.parse(reply));
        } else {
          const user = {
            id: profile.id,
            name: profile.displayName,
          };
          client.set(profile.id, JSON.stringify(user), (err, success) => {
            if (success === 'OK') {
              done(null, user);
            }
          });
        }
      });
    }
  )
);
