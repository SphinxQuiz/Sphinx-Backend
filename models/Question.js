const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const question = mongoose.Schema(
  {
    category: { type: String, required: true},
    type: { type: String, required: true},
    difficulty: { type: String, required: true},
    question: { type: String, required: true, unique: true },
    correct_answer: { type: String, required: true},
    incorrect_answers: [String],
  },
);

question.plugin(uniqueValidator);

module.exports = mongoose.model("Question", question);