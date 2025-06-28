const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  repRange: { type: String, required: true }, 
  muscles: [String],
});

module.exports = mongoose.model('Exercise', exerciseSchema);

