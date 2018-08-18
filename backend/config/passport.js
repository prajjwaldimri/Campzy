const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

const UserModel = require('../models/user.js');

passport.use(
  new LocalStrategy(
    {
      userNameField: 'email',
    },
    async (username, password, done) => {
      try {
        console.log(username);
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
