
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// const employeeModel = require('../models/employeeSchema');
const keys = require('../utils/config/index');

// super admin token verification
let opts1 = {};
opts1.secretOrKey = keys.adminsecret;
opts1.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

module.exports = passport => {
  // super admin Verification
  passport.use('admin', new jwtStrategy(opts1, (jwt_payload, done) => {
      employeeModel.find({ _id: jwt_payload._id })
        .then(user => {
          if (user == null) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        })
        .catch(error => console.log(error));
    }
  ));
}

