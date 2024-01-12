const express = require("express");
const { getFaculties } = require("../controllers/faculties.controller");
const router = express.Router();

router.get("/getfaculties",getFaculties);

module.exports = router;