const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const upload = multer({dest:"uploads/"});
const fetchUser = require("../middlewares/fetchUser.js");
const checkIsSuperAdmin = require("../middlewares/checkIsSuperAdmin.js");
const { registerStudentsInBulk ,getStudents, getDivisions, getIndividualStudentsFromSid, studentForgotPassword, verifyOTP, resetPassword, loginStudent, getIndividualStudentsFromId, registerStudentIndividually, updateStudentData, changeUserProfilePic, changePassword, changeStudentStatus, getStudentCountCourseWise, promoteStudentsToNextSemester, registerFireBaseToken} = require("../controllers/students.controller.js");




router.post("/registerInBulk",checkIsSuperAdmin,upload.single("studentcsv"),registerStudentsInBulk)

router.post("/registerIndividual",checkIsSuperAdmin,upload.single("profilePic"),registerStudentIndividually)

router.post("/updateStudentData",checkIsSuperAdmin,updateStudentData)
router.post("/changeProfilePhoto",fetchUser,upload.single("profilePic"),changeUserProfilePic)
router.post("/changePassword",fetchUser,changePassword)
router.patch("/changeStatus",checkIsSuperAdmin,changeStudentStatus);

router.post("/forgotPassword",studentForgotPassword);
router.post("/verifyOTP",verifyOTP);
router.post("/resetPassword",fetchUser,resetPassword);
router.post("/login",loginStudent);

router.get("/getStudents",fetchUser,getStudents)
router.get("/getIndividualStudents/:id",fetchUser,getIndividualStudentsFromSid)
router.get("/getSpecificStudents/:id",fetchUser,getIndividualStudentsFromId)
router.get("/getDivisions",fetchUser,getDivisions)

router.patch("/promoteStudentsToNextSemester",checkIsSuperAdmin,promoteStudentsToNextSemester);

router.get("/getStudentDataCourseWise",checkIsSuperAdmin,getStudentCountCourseWise);

router.post("/registerFireBaseToken",fetchUser,registerFireBaseToken);

module.exports = router;