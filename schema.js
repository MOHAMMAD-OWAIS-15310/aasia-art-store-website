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

module.exports.reviewSchema =Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required(),
})