//- setting authCheck middleware
module.exports = {
  authCheck: (req, res, next) => {
    //- 使用passport提供的isAuthenticated確認身分驗證
    if (req.isAuthenticated()) {
      return next();
    }
    //- 若沒驗證成功導向登入頁
    return res.redirect("/users/login");
  },
};
