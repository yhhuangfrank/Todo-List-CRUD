//- set users route
const router = require("express").Router();
//- require User model
const User = require("../../models/user");

router.get("/login", (req, res) => {
  return res.render("login");
});

router.get("/register", (req, res) => {
  return res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  //- confirm user
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        console.log("User already exists!");
        return res.render("register", {
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
        .then(() => res.redirect("/"))
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
