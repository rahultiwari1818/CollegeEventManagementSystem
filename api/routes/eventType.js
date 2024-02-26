const express = require("express");
const checkIsSuperAdmin = require("../middlewares/checkIsSuperAdmin");
const { addEventType, getAllEventTypes } = require("../controllers/eventType.controller");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../utils.js");
const fetchUser = require("../middlewares/fetchUser.js");
const upload = multer({ storage: storage }); 

router.post("/addEventType",checkIsSuperAdmin,upload.single("eventTypeLogo"),addEventType)
router.get("/getEventTypes",fetchUser,getAllEventTypes)

module.exports = router;