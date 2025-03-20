const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string().min(3).max(15);
const price = Joi.number().precision(2).min(10);
const image = Joi.string().uri();

const createSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  image: image.required(),
});

const updateSchema = Joi.object({
  name: name,
  price: price,
  image: image,
});

const getSchema = Joi.object({
  id: id.required(),
});

module.exports = { getSchema, updateSchema, createSchema };
