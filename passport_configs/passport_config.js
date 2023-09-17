const LocalStrategy = require('passport-local').Strategy;
const mongoose = require("mongoose");
const User = require('../src/user/user.model');
const bcrypt = require('bcrypt');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        return done(null, false, { message: 'No user with that email' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (error) {
      return done(error);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return done(null, false, { message: 'Invalid user ID' });
      }
      const user = await User.findById(id);
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });  
}

module.exports = initialize;