const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6, select: false },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  address: {
    street: String, city: String, state: String, zipCode: String, country: String
  },
  googleId: { type: String, default: null },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  refreshToken: String,
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
  height: { type: Number },
  weight: { type: Number },
  bloodGroup: { type: String },
  allergies: [String],
  medicalHistory: [{ condition: String, diagnosedDate: Date, notes: String }],
  emergencyContact: { name: String, phone: String, relationship: String },
  healthProfile: {
    smokingStatus: { type: String, enum: ['never', 'former', 'current'], default: 'never' },
    alcoholConsumption: { type: String, enum: ['never', 'occasional', 'moderate', 'heavy'], default: 'never' },
    exerciseFrequency: { type: String, enum: ['never', 'rarely', 'sometimes', 'often', 'daily'], default: 'sometimes' },
    sleepHours: { type: Number, default: 7 },
    dietType: { type: String, enum: ['vegetarian', 'non-vegetarian', 'vegan', 'other'], default: 'non-vegetarian' }
  }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
