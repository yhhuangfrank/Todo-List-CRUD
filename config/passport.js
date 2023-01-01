//- require passport and LocalStrategy
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");
//- require bcrypt
const bcrypt = require("bcryptjs");

//- export function for passport setting
module.exports = (app) => {
  //- passport middleware setting
  app.use(passport.initialize());
  app.use(passport.session());

  //- use LocalStrategy
  passport.use(
    new LocalStrategy(
      {
        //- 將預設的username改為email(因form設定欄位為email)
        usernameField: "email",
      },
      (email, password, done) => {
        //- check user's login
        return (
          User.findOne({ email })
            .then((user) => {
              if (!user) {
                return done(null, false, {
                  message: "This user is not registered！",
                });
              }
              //- check password by bcrypt (return boolean promise)
              return bcrypt
                .compare(password, user.password)
                .then((isMatched) => {
                  if (!isMatched) {
                    return done(null, false, {
                      message: "Your password is incorrect！",
                    });
                  }
                  //- login success
                  return done(null, user);
                });
            })
            //- if any error occurred
            .catch((err) => done(err, false))
        );
      }
    )
  );

  //- serialization and deserialization
  passport.serializeUser((user, done) => {
    return done(null, user);
  });
  passport.deserializeUser((id, done) => {
    return User.findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
    //- 使用null表示user資料為空
  });
};
