const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  genre: {
    type: genreSchema,
    required: true,
  },
  adminUser: {
    type: mongoose.Schema.Types.ObjectId,
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Group = mongoose.model('Group', groupSchema);

function validateGroup(group) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    description: Joi.string().min(5).max(50),
    user: Joi.array().items(Joi.string()),
    genreId: Joi.string().required(),
  });
  return schema.validate(group);
}

exports.Group = Group;
exports.validate = validateGroup;
