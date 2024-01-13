const express = require("express");
const { setUpSystem, getFaculties } = require("../controllers/faculties.controller");
const router = express.Router();

router.get("/getfaculties",getFaculties);

router.post("/setup",setUpSystem);
module.exports = router;