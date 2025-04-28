const reviewModel = require("../Models/ReviewModel");

// Add a review - POST API

const createReview = async (req, res) => {
    try {
        const { userId, remarks } = req.body;

        const addReview = await reviewModel.create({ userId, remarks });

        if (!addReview) { return res.status(404).json({ message: "Error while creating a review" }); }

        return res.status(200).json({ message: "Review added successfully", addReview });

    } catch (error) {
        console.error("Internal server error", error);
        return res.status(404).json({ message: "Internal server error", error });
    }
}


// Get all reviews - GET API

const getAllReviews = async (req, res) => {

}

module.exports = createReview;