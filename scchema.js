const Joi = require("joi");

export const userSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
    /*image: {
          url: Joi.string().allow("", null)
         }*/
  }).required(),
});
