const express = require('express');
const router = express.Router();
const roomController = require('../Controllers/room-controller');

router.post("/create-room", roomController.createRoom);
router.get("/all-rooms", roomController.getAllRooms);
router.get("/single-room", roomController.getSingleRoomDetails);

module.exports = router;
