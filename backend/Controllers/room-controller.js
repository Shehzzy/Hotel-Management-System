const roomModel = require('../Models/RoomModel');


// Room Creation API

const createRoom = async (req, res) => {
    try {
        const { roomNumber, roomType, pricePerNight, bedCount, floor, hasAC, hasWIFI, hasTV, isAvailable, roomStatus } = req.body;
        const findAnExistingRoom = await roomModel.findOne({ roomNumber: roomNumber });

        if (findAnExistingRoom) { return res.status(400).json({ message: "Room already exists" }); }
        const room = await roomModel.create({
            roomNumber, roomType, pricePerNight, bedCount, floor, hasAC, hasTV, hasWIFI, isAvailable, roomStatus
        });
        if (room) {
            return res.status(200).json({ message: "Room has been created successfully", room });
        }

    } catch (error) {
        console.error("Server error", error);
        return res.status(400).json({ message: "Server error", error });

    }
}

// GET all rooms API
const getAllRooms = async (req, res) => {

    try {
        const allRooms = await roomModel.find();
        if (!allRooms) { return res.status(404).json({ message: "No rooms found" }); }
        if (allRooms.length == 0) { return res.status(404).json({ message: "No rooms found" }); }

        return res.status(200).json({ message: "All rooms found", findRooms: allRooms });

    } catch (error) {
        console.error("Server error", error);
        return res.status(400).json({ message: "Server error", error });
    }

}

// GET Single Room details API
const getSingleRoomDetails = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const singleRoom = await roomModel.findOne({ _id: roomId });
        if (!singleRoom) { return res.status(404).json({ message: "Room not found"});}
        return res.status(200).json({message:"Here is your room details", findRoom: singleRoom});
    } catch (error) {

    }
} 


module.exports = {createRoom, getAllRooms, getSingleRoomDetails};