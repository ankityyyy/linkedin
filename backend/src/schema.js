const Joi = require("joi");

const userSchemaRegister = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  number: Joi.number().integer().min(0).required(),
  token: Joi.string().allow("", null),
}).required();

const userSchemaLogin = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
}).required();

//post

const CreatepostSchema= Joi.object({
  body: Joi.string().required(),
  media: Joi.string().allow("").optional(),
  fileType: Joi.string().allow("").optional(),
});

const updatePostSchema = Joi.object({
  body: Joi.string().optional(),
  media: Joi.string().allow("").optional(),
  fileType: Joi.string().allow("").optional(),
});


module.exports={CreatepostSchema,userSchemaRegister,userSchemaLogin,updatePostSchema};