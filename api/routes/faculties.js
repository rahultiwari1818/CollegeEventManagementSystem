const express = require("express");
const { setUpSystem, getFaculties,registerIndividualFaculties, loginFaculty, registerFacultiesInBulk, getIndividualFaculty, facultyForgotPassword, verifyOTP, resetPassword, updateFacultyData, changeFacultyProfilePic, changePassword } = require("../controllers/faculties.controller");
const {checkSetUp} = require("../controllers/college.controller");
const fetchUser = require("../middlewares/fetchUser");
const checkIsAdmin = require("../middlewares/checkIsAdmin.js");
const multer = require("multer");
const { storage } = require("../utils.js");
const checkIsFaculty = require("../middlewares/checkIsFaculty.js");
const checkIsSuperAdmin = require("../middlewares/checkIsSuperAdmin.js");
const upload = multer({storage:storage});
const router = express.Router();


router.post("/registerIndividual",checkIsSuperAdmin,upload.single("profilePic"),registerIndividualFaculties );
router.post("/registerInBulk",checkIsSuperAdmin,upload.single("facultycsv"),registerFacultiesInBulk );
router.post("/updateFacultyData",checkIsSuperAdmin,updateFacultyData);
router.post("/changeProfilePhoto",checkIsSuperAdmin,upload.single("profilePic"),changeFacultyProfilePic);
router.post("/changePassword",fetchUser,changePassword)

router.post("/forgotPassword",facultyForgotPassword);
router.post("/verifyOTP",verifyOTP);
router.post("/resetPassword",fetchUser,resetPassword);
router.post("/login",loginFaculty)
router.get("/isSetUpDone",checkSetUp)
router.get("/getfaculties",checkIsAdmin,getFaculties);
router.get("/getSpecificFaculty/:id",checkIsFaculty,getIndividualFaculty)
router.post("/setup",setUpSystem);
module.exports = router;