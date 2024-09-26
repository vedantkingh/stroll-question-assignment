const mongoose = require('mongoose');

// For future use to improve scalability, we could possibly have a single call to get all the data for that region and cache it for a day.
const CycleSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  region: String,
  questionIds: [mongoose.Schema.Types.ObjectId],
});

module.exports = mongoose.model('Cycle', CycleSchema);