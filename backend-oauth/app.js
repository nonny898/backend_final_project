const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const cors = require('cors');
const dotenv = require('dotenv');
const keys = require('./config/keys');

dotenv.config();

require('./config/passport-setup');

const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');

mongoose.connect(
  `mongodb://${process.env.MONGODB_ENV}:27017/backend-project-2020`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const app = express();
app.use(
  cors({
    origin: 'http://localhost:8080', // restrict calls to those this address
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

app.listen(3000);
