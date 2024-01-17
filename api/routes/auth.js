const express = require("express");
const router = express.Router();
const { checkIsLoggedIn } = require("../controllers/auth.controller");
const fetchUser = require("../middlewares/fetchUser");




router.post("/checkIsLoggedIn",fetchUser,checkIsLoggedIn);

module.exports = router;