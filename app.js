//- require related modules
const express = require("express");
//- require express-session
const session = require("express-session");
const bodyParser = require("body-parser");
//- 引入method-override將form的POST請求改寫
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
//- require connect-flash
const flash = require("connect-flash");
//- 引入router
const routes = require("./routes/index");
//- 使用passport套件
const usePassport = require("./config/passport");

//- 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//- 連線monggose
require("./config/mongoose");
const app = express();
//- 如果在 Heroku 環境則使用 process.env.PORT
//- 否則為本地環境，使用 3000
const PORT = process.env.PORT || 3000;

//- set view engine (handlebars)，設定extname(副檔名為".hbs")
app.engine("hbs", exphbs({ defaultLayouts: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

//- use express-seesion
app.use(
  session({
    secret: "MySessionSecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
//- bodyparser middleware
app.use(bodyParser.urlencoded({ extended: true }));
//- method-override middleware
app.use(methodOverride("_method"));
//- run usePassport
usePassport(app);

//- flash middleware
app.use(flash());

//- set res.locals variable for res.render
app.use((req, res, next) => {
  //- 利用express.js提供res.locals存取req內常用資訊
  //- 並在render時提供給handle-bars
  res.locals.isAuthenticated = req.isAuthenticated();
  //- 利用在deserialization step產生的req.user
  res.locals.user = req.user;
  //! flash msg setting
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  next();
});

//- set route
app.use(routes);

//- listen to server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost${PORT}`);
});
