const router = require("express").Router();
const passport = require("passport");

//- 當user點擊透過facebook登入後向user請求授權
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "public_profile"],
  })
);

//- 當facebook給予user資訊時觸發重新導向
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

module.exports = router;
