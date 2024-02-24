const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const upload = multer({dest:"uploads/"});
const fetchUser = require("../middlewares/fetchUser.js");
const checkIsSuperAdmin = require("../middlewares/checkIsSuperAdmin.js");
const { registerStudentsInBulk ,getStudents, getDivisions, getIndividualStudentsFromSid, studentForgotPassword, verifyOTP, resetPassword, loginStudent, getIndividualStudentsFromId, registerStudentIndividually} = require("../controllers/students.controller.js");




router.post("/registerInBulk",checkIsSuperAdmin,upload.single("studentcsv"),registerStudentsInBulk)

router.post("/registerIndividual",checkIsSuperAdmin,upload.single("profilePic"),registerStudentIndividually)

router.post("/forgotPassword",studentForgotPassword);
router.post("/verifyOTP",verifyOTP);
router.post("/resetPassword",fetchUser,resetPassword);
router.post("/login",loginStudent);

router.get("/getStudents",fetchUser,getStudents)
router.get("/getIndividualStudents/:id",fetchUser,getIndividualStudentsFromSid)
router.get("/getSpecificStudents/:id",fetchUser,getIndividualStudentsFromId)
router.get("/getDivisions",fetchUser,getDivisions)
module.exports = router;