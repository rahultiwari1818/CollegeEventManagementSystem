const express = require("express");
const router = express.Router();
const {
    registerFaculties,
    loginFaculty
} = require("../controllers/faculties.controller");



router.post("/register", registerFaculties);

router.post("/login",loginFaculty)

module.exports = router;