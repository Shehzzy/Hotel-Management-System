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
        if (!singleRoom) { return res.status(404).json({ message: "Room not found" }); }
        return res.status(200).json({ message: "Here is your room details", findRoom: singleRoom });
    } catch (error) {

    }
}


//  Update Single Room Details API
const updateRoomDetails = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const findRoom = await roomModel.findOne({ _id: roomId });

        if (!findRoom) { return res.status(404).json({ message: "Room not found" }); }
        const updateRoom = await roomModel.findByIdAndUpdate(
            roomId,
            req.body,
            { new: true }
        );
        if (!updateRoom) { return res.status(404).json({ message: "An error occured while updating room details" }); }
        return res.status(200).json({ messgae: "Room details updated successfully", updateRoom });

    } catch (error) {
        console.error("Server error", error);
        return res.status(404).json({ message: "Server error", error });
    }
}


// DELETE A ROOM API - NOT FOR USE
const deleteRoom = async (req, res) => {
    try {
        const findRoom = await roomModel.findOne({ _id: req.params.roomId });
        if (!findRoom) { return res.status(404).json({ message: "Room not found" }); }
        const deleteRoom = await roomModel.findByIdAndDelete(req.params.roomId);
        if (deleteRoom) { return res.status(200).json({ message: "Room has been deleted", deleteRoom }); }

    } catch (error) {
        console.error("Server error", error);
        return res.status(400).json({ message: "Server error", error });
    }
}


// update room status API
const updateRoomStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const findRoom = await roomModel.findOne({ _id: req.params.roomId });
        if (!findRoom) { return res.status(404).json({ message: "No room found" }); }
        const currentRoomStatus = findRoom.roomStatus;
        if (currentRoomStatus === status) {
            return res.status(404).json({ message: `This room's status is ${currentRoomStatus}` });
        }

        if (currentRoomStatus !== status) {
            const updateStatus = await roomModel.findByIdAndUpdate(req.params.roomId, { roomStatus: status }, { new: true });
            return res.status(200).json({ message: `The room has been successfully ${status}`, updateStatus });
        }
    } catch (error) {
        console.error("Server error", error);
        return res.status(404).json({ message: "Server error", error });

    }
}


module.exports = { createRoom, getAllRooms, getSingleRoomDetails, updateRoomDetails, deleteRoom, updateRoomStatus };