const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const {
    generateEvent,
    getAllEvents,
    getSpecificEvent,
    changeEventStatus,
    updateEventDetails,
    registerInEvent,
    getRegistrationDataOfEvent,
    approveOrRejectRegistrationRequest,
    studentParticipatedEvents,
    resultDeclaration,
    getResults
} = require("../controllers/events.controller.js");
const fetchUser = require("../middlewares/fetchUser.js");
const checkIsAdmin = require("../middlewares/checkIsAdmin.js");
const { storage } = require("../utils.js");
const upload = multer({ storage: storage }); 





router.post("/generateevent", checkIsAdmin, upload.fields([{ name: 'eposter' }, { name: 'ebrochure' }]), generateEvent);


router.get("/getevents",fetchUser,getAllEvents);

router.get("/getSpecificEvent/:id",fetchUser,getSpecificEvent);

router.patch("/changeEventStatus/:id",checkIsAdmin,changeEventStatus);

router.patch("/updateEventDetails/:id",checkIsAdmin,upload.fields([{ name: 'eposter' }, { name: 'ebrochure' }]),updateEventDetails);

router.post("/registerInEvent",fetchUser,registerInEvent)

router.get("/getRegistrationDataOfEvent",checkIsAdmin,getRegistrationDataOfEvent);

router.patch("/changeRequestStatus",checkIsAdmin,approveOrRejectRegistrationRequest);

router.get('/studentParticipatedEvents/:studentId',fetchUser,studentParticipatedEvents)

router.post("/declareResult/:eventId",checkIsAdmin,resultDeclaration);

router.get("/:eventId/getResults",fetchUser,getResults);

module.exports = router;