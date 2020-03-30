const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const cors = require('cors');
const keys = require('./config/keys');
const env = require('./config/env');

require('./config/passport-setup');

const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');

const app = express();
app.use(
  cors({
    origin: `http://${env.CORS_DEBUG}`, // restrict calls to those this address
    methods: 'GET', // only allow GET requests
    credentials: true,
  })
);

app.use(
  cookieSession({
    maxAge: 6 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.listen(3000, () => {
  console.log('listening on 3000');
});
