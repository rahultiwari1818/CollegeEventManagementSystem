const express = require("express");
const { setUpSystem, getFaculties } = require("../controllers/faculties.controller");
const {checkSetUp} = require("../controllers/college.controller");
const fetchUser = require("../middlewares/fetchUser");
const router = express.Router();

router.get("/isSetUpDone",checkSetUp)
router.get("/getfaculties",fetchUser,getFaculties);

router.post("/setup",setUpSystem);
module.exports = router;