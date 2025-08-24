const mongoose = require('mongoose');
const WorkoutLog = require('../models/workoutLogSchema'); 

async function getExerciseHistory(userId, exerciseName) {
  return WorkoutLog.aggregate([
    { 
      $match: { 
        userId: new mongoose.Types.ObjectId(userId),
        'exercises.name': exerciseName
      }
    },
    { $unwind: "$exercises" },
    { 
      $match: { 
        "exercises.name": exerciseName,
        "exercises.performedSets": { $exists: true, $not: { $size: 0 } }
      }
    },
    { $unwind: "$exercises.performedSets" },
    { 
      $match: { 
        "exercises.performedSets.weight": { $gt: 0 }
      }
    },
    {
      $group: {
        _id: { 
          $dateToString: { 
            format: "%Y-%m-%d", 
            date: "$date" 
          } 
        },
        date: { $first: "$date" },
        totalVolume: {
          $sum: { 
            $multiply: [
              "$exercises.performedSets.weight", 
              "$exercises.performedSets.reps"
            ]
          }
        },
        maxWeight: { $max: "$exercises.performedSets.weight" },
        totalReps: { $sum: "$exercises.performedSets.reps" }
      }
    },
    { $sort: { date: 1 } },
    {
      $project: {
        _id: 0,
        date: 1,
        weight: "$maxWeight",
        volume: "$totalVolume",
        reps: "$totalReps"
      }
    }
  ]);
}

module.exports = getExerciseHistory;