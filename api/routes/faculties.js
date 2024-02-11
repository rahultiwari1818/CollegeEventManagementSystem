const express = require("express");
const { setUpSystem, getFaculties, registerFaculties, loginFaculty } = require("../controllers/faculties.controller");
const {checkSetUp} = require("../controllers/college.controller");
const fetchUser = require("../middlewares/fetchUser");
const checkIsAdmin = require("../middlewares/checkIsAdmin.js");
const router = express.Router();


router.post("/register",checkIsAdmin, registerFaculties);
router.post("/login",loginFaculty)
router.get("/isSetUpDone",checkSetUp)
router.get("/getfaculties",checkIsAdmin,getFaculties);

router.post("/setup",setUpSystem);
module.exports = router;