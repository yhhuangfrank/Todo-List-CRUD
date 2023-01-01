//- require passport and LocalStrategy
const passport = require("passport");
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");
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

  //- FacebookStrategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ["email", "displayName"],
      },
      (accessToken, refreshToken, profile, done) => {
        //- 獲得一包proflie檔案，抽取所需資料
        const { name, email } = profile._json;
        //- 判斷是否曾經註冊過系統
        return User.findOne({ email })
          .then((user) => {
            //- 已註冊過
            if (user) return done(null, user);
            //- 新用戶，將一隨機數轉為36進位文字擷取8位當作密碼並hash
            const randomPassword = Math.random().toString(36).slice(-8);
            return bcrypt
              .genSalt(10)
              .then((salt) => bcrypt.hash(randomPassword, salt))
              .then((hash) =>
                User.create({
                  name,
                  email,
                  password: hash,
                })
              )
              .then((user) => done(null, user));
          })
          .catch((err) => done(err, false));
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
