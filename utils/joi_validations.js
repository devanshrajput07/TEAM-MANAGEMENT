const Joi = require("joi");

const createPlannerSchema = Joi.object({
    date: Joi.string().required(),
    note: Joi.string(),
});

const updatePlannerSchema = Joi.object({
    note: Joi.string(),
});

module.exports = {
    createPlannerSchema,
    updatePlannerSchema
}