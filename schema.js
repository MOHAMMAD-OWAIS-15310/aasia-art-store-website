const Joi = require('joi');
module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        price : Joi.number().required(),
        size : Joi.string().required(),
        medium : Joi.string().required(),
        available : Joi.string().valid("yes","no").required(),
        image : Joi.string().allow("",null),

    }).required()
});