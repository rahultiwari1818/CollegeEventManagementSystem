const express = require("express");
const { setUpSystem, getFaculties,registerIndividualFaculties, loginFaculty, registerFacultiesInBulk, getIndividualFaculty } = require("../controllers/faculties.controller");
const {checkSetUp} = require("../controllers/college.controller");
const fetchUser = require("../middlewares/fetchUser");
const checkIsAdmin = require("../middlewares/checkIsAdmin.js");
const multer = require("multer");
const { storage } = require("../utils.js");
const checkIsFaculty = require("../middlewares/checkIsFaculty.js");
const upload = multer({storage:storage});
const router = express.Router();


router.post("/registerIndividual",checkIsAdmin,registerIndividualFaculties );
router.post("/registerInBulk",checkIsAdmin,upload.single("facultycsv"),registerFacultiesInBulk );
router.post("/login",loginFaculty)
router.get("/isSetUpDone",checkSetUp)
router.get("/getfaculties",checkIsAdmin,getFaculties);
router.get("/getSpecificFaculty/:id",checkIsFaculty,getIndividualFaculty)
router.post("/forgotPassword",async(req,res)=>{})
router.post("/setup",setUpSystem);
module.exports = router;