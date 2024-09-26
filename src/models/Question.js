const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  content: String,
  region: { type: String, index: true },
});

module.exports = mongoose.model('Question', QuestionSchema);