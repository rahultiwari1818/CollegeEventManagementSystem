const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const upload = multer({dest:"uploads/"});
const fetchUser = require("../middlewares/fetchUser.js");
const checkIsAdmin = require("../middlewares/checkIsAdmin.js");
const { registerStudentsInBulk ,getStudents, getDivisions, getIndividualStudentsFromSid, studentForgotPassword, verifyOTP, resetPassword, loginStudent, getIndividualStudentsFromId} = require("../controllers/students.controller.js");




router.post("/registerInBulk",checkIsAdmin,upload.single("studentcsv"),registerStudentsInBulk)

router.post("/registerIndividual",checkIsAdmin,async()=>{

})

router.post("/forgotPassword",studentForgotPassword);
router.post("/verifyOTP",verifyOTP);
router.post("/resetPassword",fetchUser,resetPassword);
router.post("/login",loginStudent);

router.get("/getStudents",fetchUser,getStudents)
router.get("/getIndividualStudents/:id",fetchUser,getIndividualStudentsFromSid)
router.get("/getSpecificStudents/:id",fetchUser,getIndividualStudentsFromId)
router.get("/getDivisions",fetchUser,getDivisions)
module.exports = router;