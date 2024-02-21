const express = require("express");
const checkIsSuperAdmin = require("../middlewares/checkIsSuperAdmin");
const { addCourse, getAllCourses } = require("../controllers/course.controller");
const router = express.Router();

router.post("/addCourse",checkIsSuperAdmin,addCourse);
router.get("/getCourses",checkIsSuperAdmin,getAllCourses);

module.exports = router;