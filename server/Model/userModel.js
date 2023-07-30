const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name Must Be Required To Create An Account'],
  },
  email: {
    type: String,
    required: [true, 'E-mail Must Be Required To Create An Account'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Provide An Valid E-mail'],
  },
  password: {
    type: String,
    required: [true, 'Password Must Be Required To Create An Account'],
    minlength: [8, 'Why The PassWord Is Too Small??'],
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'guide'],
    default: 'user',
  },
  passwordConfirm: {
    type: String,
    required: [true, 'PasswordConfirm Must Be Required To Create An Account'],
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: 'Password does not match',
    },
  },
  photo: String,
  passwordChangedAt: Date,
  forgetCryptoToken: String,
  forgetCryptoTokenTime: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now();
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

userSchema.methods.correctPassword = async function (userPassword, DBPassword) {
  return await bcrypt.compare(userPassword, DBPassword);
};

userSchema.methods.passwodChanged = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimeStamp < changedTime;
    // 1687539145 < 1687541945
  }
  return false;
};

userSchema.methods.cryptoToken = function () {
  const newToken = crypto.randomBytes(32).toString('hex');
  this.forgetCryptoToken = crypto.createHash('sha256').update(newToken).digest('hex');
  this.forgetCryptoTokenTime = Date.now() + 10 * 60 * 1000;
  return newToken;
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
