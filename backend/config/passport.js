const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportJWT = require('passport-jwt');

const JWTStrategy = passportJWT.Strategy;
const bcrypt = require('bcrypt');

const UserModel = require('../models/user.js');

passport.use(
  new LocalStrategy(
    {
      userNameField: 'email',
    },
    async (username, password, done) => {
      try {
        const userDocument = await UserModel.findOne({ email: username }).exec();
        const passwordsMatch = await bcrypt.compare(password, userDocument.password);
        if (passwordsMatch) {
          return done(null, userDocument);
        }
        return done('Incorrect Username / Password');
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: req => req.cookies.jwt,
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, done) => {
      if (jwtPayload.expires > Date.now()) {
        return done('JWT Expired');
      }

      return done(null, jwtPayload);
    },
  ),
);
