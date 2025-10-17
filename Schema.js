const joi=require('joi');
const review = require('./modules/review');

const listingschema=joi.object({
   listing:joi.object(
    {
        title:joi.string().required(),
        description:joi.string().required(),
        country:joi.string().required(),
        location:joi.string().required(),
        price:joi.number().required().min(0),
        image:joi.object({
            url:joi.string(),
            filename:joi.string()
        })
    }
   ).required()
});

const reviewschema=joi.object({
    review:joi.object({
        Comment:joi.string().required(),
        rating:joi.number().required().min(1).max(5)
    }).required()
});

module.exports={listingschema,reviewschema}