const express = require("express");
const checkIsSuperAdmin = require("../middlewares/checkIsSuperAdmin");
const { addCourse, getAllCourses } = require("../controllers/course.controller");
const fetchUser = require("../middlewares/fetchUser");
const router = express.Router();

router.post("/addCourse",checkIsSuperAdmin,addCourse);
router.get("/getCourses",fetchUser,getAllCourses);

module.exports = router;