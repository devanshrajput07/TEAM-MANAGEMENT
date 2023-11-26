const { User } = require('../models/userModel');
const Planner = require('../models/planner');
const { createPlannerSchema, updatePlannerSchema } = require('../utils/joi_validations');

const getPlannerByDate = async (req, res) => {
    try {
        const date = req.params.date;
        const planner = await Planner.findOne({ date: date, UserId: req.user._id });

        if (!planner) {
            return res.status(404).json({ success: false, message: 'Planner not found' });
        }

        if (req.user._id.toString() !== planner.UserId.toString()) {
            return res.status(400).json({ success: false, message: "You are not allowed to access this planner!" });
        }

        res.json({
            success: true,
            data: { planner }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const createPlanner = async (req, res) => {
    try {
        const input = await createPlannerSchema.validateAsync(req.body);
        const { date, note } = req.body;
        const existing = await Planner.findOne({ date: date, UserId: req.user._id });

        if (existing) {
            return res.status(400).json({ success: false, message: "Planner already exists!" });
        }

        const newPlanner = new Planner({
            date,
            note,
            UserId: req.user._id
        });

        const savedPlanner = await newPlanner.save();
        res.status(201).json({
            success: true,
            message: "Creation Successful",
            data: { savedPlanner }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updatePlannerByDate = async (req, res) => {
    try {
        const input = await updatePlannerSchema.validateAsync(req.body);
        const { note } = req.body;
        const date = req.params.date;
        const planner = await Planner.findOne({ date: date, UserId: req.user._id });

        if (!planner) {
            return res.status(404).json({ success: false, message: 'Planner not found' });
        }

        if (req.user._id.toString() !== planner.UserId.toString()) {
            return res.status(400).json({ success: false, message: "You are not allowed to update this planner!" });
        }

        const updatedPlanner = await Planner.findOneAndUpdate(
            { date: date },
            { note },
            { new: true }
        );

        if (!updatedPlanner) {
            return res.status(404).json({ success: false, message: 'Planner not found' });
        }

        res.json({
            success: true,
            message: "Updation Successful",
            data: updatedPlanner
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deletePlannerByDate = async (req, res) => {
    try {
        const date = req.params.date;
        const planner = await Planner.findOne({ date: date, UserId: req.user._id });

        if (!planner) {
            return res.status(404).json({ success: false, message: 'Planner not found' });
        }

        if (req.user._id.toString() !== planner.UserId.toString()) {
            return res.status(400).json({ success: false, message: "You are not allowed to delete this planner!" });
        }

        const deletedPlanner = await Planner.findOneAndDelete({ date: date });

        if (!deletedPlanner) {
            return res.status(404).json({ success: false, message: 'Planner not found' });
        }

        res.json({
            success: true,
            message: "Deletion Successful"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    getPlannerByDate,
    createPlanner,
    updatePlannerByDate,
    deletePlannerByDate
};
