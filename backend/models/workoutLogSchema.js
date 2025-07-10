const mongoose = require('mongoose');

const PerformedSetSchema = new mongoose.Schema({
  reps: { type: Number, required: true },
  weight: { type: Number, required: true }
}, { _id: false });

const ExerciseLogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  performedSets: [PerformedSetSchema]
}, { _id: false });

const workoutLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  sessionOrder: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  exercises: [ExerciseLogSchema]
});

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
