const express = require("express");
const router = express.Router();
const {
    createBoard,
    getBoards,
    getBoard,
    updateBoard,
    deleteBoard,
    archiveBoard,
    unarchiveBoard,
    addMember,
    removeMember,
} = require("../controller/boardController");
const { isLoggedIn } = require("../middleware/userMiddleware");
router.route("/createBoard").post(isLoggedIn, createBoard);
router.route("/getBoards").get(isLoggedIn, getBoards);
router.route("/getBoard/:id").get(isLoggedIn, getBoard);
router.route("/updateBoard/:id").post(isLoggedIn, updateBoard);
router.route("/deleteBoard/:id").delete(isLoggedIn, deleteBoard);
router.route("/archiveBoard/:id").get(isLoggedIn, archiveBoard);
router.route("/unarchiveBoard/:id").get(isLoggedIn, unarchiveBoard);
router.route("/addMember/:id").post(isLoggedIn, addMember);
router.route("/removeMember/:id").post(isLoggedIn, removeMember);



















module.exports = router;
