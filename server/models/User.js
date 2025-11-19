const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: false,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@vitbhopal\.ac\.in$/.test(v);
      },
      message: 'Email must be a valid @vitbhopal.ac.in email address'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
});

// Method to compare password for login (plain text comparison)
userSchema.methods.comparePassword = async function(candidatePassword) {
  return this.password === candidatePassword;
};

module.exports = mongoose.model('User', userSchema);

