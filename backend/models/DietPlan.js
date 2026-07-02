const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planName: { type: String, default: 'Weekly Diet Plan' },
  userProfile: {
    age: Number,
    weight: Number,
    height: Number,
    disease: String,
    goal: String
  },
  weeklyPlan: [{
    day: String,
    meals: [{
      type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
      name: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      ingredients: [String],
      instructions: String
    }],
    totalCalories: Number,
    waterIntake: Number,
    sleepSchedule: { bedtime: String, wakeTime: String },
    workoutPlan: { type: String, exercises: [{ name: String, sets: Number, reps: Number, duration: String }] }
  }],
  isActive: { type: Boolean, default: true },
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', dietPlanSchema);
