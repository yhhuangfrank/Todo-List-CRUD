//! index為總路由器
const express = require("express");
const router = express.Router(); //- express 路由器
//- 引入路由modules
const home = require("./modules/home");
const todos = require("./modules/todos");
const users = require("./modules/users");
const auth = require("./modules/auth");
//- require authCheck middleware
const { authCheck } = require("../middleware/auth");

router.use("/users", users);
router.use("/todos", authCheck, todos);
router.use("/auth", auth);
router.use("/", authCheck, home);

//- 匯出路由器
module.exports = router;
