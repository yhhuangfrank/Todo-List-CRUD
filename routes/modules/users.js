//- set users route
const router = require("express").Router();
//- require User model
const User = require("../../models/user");
//- require passport
const passport = require("passport");

router.get("/login", (req, res) => {
  return res.render("login");
});

router.post(
  "/login",
  //- 執行passport.authenticate middleware
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

router.get("/register", (req, res) => {
  return res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  let errors = []; //- 定義註冊失敗訊息彙整
  //- 先判斷表單輸入內容
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: "所有欄位為必填!" });
  }
  if (password !== confirmPassword) {
    errors.push({ message: "密碼與確認密碼不符!" });
  }
  if (errors.length) {
    //- 若有errors存在
    return res.render("register", {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  }

  //- confirm user
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        console.log("User already exists!");
        errors.push({ message: "您已經註冊過囉!" });
        return res.render("register", {
          errors,
          name,
          email,
          password,
          confirmPassword,
        });
      }
      //- create new user
      console.log("Find new User!");
      return User.create({
        name,
        email,
        password,
      })
        .then(() => {
          req.flash("success_msg", "註冊成功!可登入系統了!");
          res.redirect("/users/login");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "已成功登出系統!");
    res.redirect("/users/login");
  }); //- passport will clear original session and req.user
});
module.exports = router;
