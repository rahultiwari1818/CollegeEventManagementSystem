const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const upload = multer({dest:"uploads/"});
const fetchUser = require("../middlewares/fetchUser.js");
const { registerStudentsInBulk ,getStudents, getDivisions} = require("../controllers/students.controller.js");




router.post("/registerInBulk",fetchUser,upload.single("studentcsv"),registerStudentsInBulk)

router.post("/registerIndividual",fetchUser,async()=>{

})

router.get("/getStudents",fetchUser,getStudents)
router.get("/getDivisions",fetchUser,getDivisions)
module.exports = router;