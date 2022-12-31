//- setting authCheck middleware
module.exports = {
  authCheck: (req, res, next) => {
    //- 使用passport提供的isAuthenticated確認身分驗證
    if (req.isAuthenticated()) {
      return next();
    }
    //- 設定沒有驗證的waring_msg
    req.flash("warning_msg", "需要先登入才能使用!");
    //- 若沒驗證成功導向登入頁
    return res.redirect("/users/login");
  },
};
