const express = require("express");
const plannerRouter = express.Router();
const plannerController = require("../controllers/plannerController");

plannerRouter.get("/:date", plannerController.getPlannerByDate);
plannerRouter.post("/add", plannerController.createPlanner);
plannerRouter.patch("/:date/update", plannerController.updatePlannerByDate);
plannerRouter.delete("/:date/delete", plannerController.deletePlannerByDate);

module.exports = plannerRouter;
