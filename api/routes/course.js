const express = require("express");
const checkIsSuperAdmin = require("../middlewares/checkIsSuperAdmin");
const { addCourse } = require("../controllers/course.controller");
const router = express.Router();

router.post("/addCourse",checkIsSuperAdmin,addCourse);

module.exports = router;