const express = require("express");
const { setUpSystem, getFaculties,registerIndividualFaculties, loginFaculty, registerFacultiesInBulk } = require("../controllers/faculties.controller");
const {checkSetUp} = require("../controllers/college.controller");
const fetchUser = require("../middlewares/fetchUser");
const checkIsAdmin = require("../middlewares/checkIsAdmin.js");
const router = express.Router();


router.post("/registerIndividual",checkIsAdmin,registerIndividualFaculties );
router.post("/registerInBulk",checkIsAdmin,registerFacultiesInBulk );
router.post("/login",loginFaculty)
router.get("/isSetUpDone",checkSetUp)
router.get("/getfaculties",checkIsAdmin,getFaculties);

router.post("/setup",setUpSystem);
module.exports = router;