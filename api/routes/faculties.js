const express = require("express");
const { setUpSystem, getFaculties,registerIndividualFaculties, loginFaculty, registerFacultiesInBulk, getIndividualFaculty, facultyForgotPassword, verifyOTP, resetPassword, updateFacultyData, changeFacultyProfilePic, changePassword, changeFacultyStatus, countFacultiesByCourse } = require("../controllers/faculties.controller");
const {checkSetUp, getCollegeData, getWholeCollegeData, updateCollegeData} = require("../controllers/college.controller");
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
router.post("/changeProfilePhoto",fetchUser,upload.single("profilePic"),changeFacultyProfilePic);
router.post("/changePassword",fetchUser,changePassword)

router.patch("/changeStatus",checkIsSuperAdmin,changeFacultyStatus);

router.post("/forgotPassword",facultyForgotPassword);
router.post("/verifyOTP",verifyOTP);
router.post("/resetPassword",fetchUser,resetPassword);
router.post("/login",loginFaculty)
router.get("/isSetUpDone",checkSetUp)
router.get("/getfaculties",checkIsAdmin,getFaculties);
router.get("/getSpecificFaculty/:id",checkIsFaculty,getIndividualFaculty)
router.post("/setup",setUpSystem);

router.get("/getCollegeData",checkIsSuperAdmin,getWholeCollegeData);

router.get("/getCollegeDetails",fetchUser,getCollegeData);

router.patch("/updateCollegeData",checkIsSuperAdmin,updateCollegeData);

router.get("/countFacultiesByCourse",checkIsSuperAdmin,countFacultiesByCourse);

module.exports = router;