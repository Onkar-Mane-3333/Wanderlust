//it is for the server validation

const Joi = require('joi');

// Joi schema to validate a listing object: ensures required fields like title, description, location, country, price, and optional image.
//.valid() = “Accept only these specific values, reject everything else.”
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.string().required().min(0),
        image: Joi.string().allow("", null),
        category: Joi.string()
        .valid(
            "Trending",
            "Rooms",
            "Iconic cities",
            "Mountains",
            "Castles",
            "Amazing Pools",
            "Camping",
            "Farms",
            "Arctic"
        )
        .required(),
    }).required(),
});


//reviewSchema → is the Joi schema you defined for validating reviews
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});