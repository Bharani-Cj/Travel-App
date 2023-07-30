const crypto = require('crypto');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const userModel = require('../Model/userModel');
const jwt = require('jsonwebtoken');
const APIError = require('../utils/APIError');
const APIEmail = require('../utils/APIEmail');

const jwtSign = function (id) {
  return jwt.sign({ id }, process.env.JWT_SUPER_STRING, {
    expiresIn: process.env.JWT_EXP_IN,
  });
};

const jwtAndRes = function (user, statusCode, res) {
  const token = jwtSign(user._id);
  res.status(statusCode).json({
    status: 'sucesses',
    token,
    data: {
      user,
    },
  });
};

exports.signIn = catchAsync(async (req, res, next) => {
  const user = await userModel.create(req.body);
  jwtAndRes(user, 200, res);
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new APIError('Please Provide Email or Password', 401));
  }

  const user = await userModel.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    next(new APIError('Your Email or Password Is incorrect', 401));
  }

  jwtAndRes(user, 200, res);
});

exports.protectRoutes = catchAsync(async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new APIError('please sign in the account', 401));
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return next(new APIError('please Login first', 401));
  }
  const user = await promisify(jwt.verify)(token, process.env.JWT_SUPER_STRING);
  if (!user) {
    return next(new APIError('Invalid Token', 401));
  }
  const currentUser = await userModel.findById(user.id);
  if (!currentUser) {
    return next(new APIError('User Not Found', 401));
  }
  if (currentUser.passwodChanged(user.iat)) {
    return next(new APIError('Password Recently changed', 401));
  }

  req.user = currentUser;

  next();
});

exports.permission = (...rest) => {
  //  rest=[admin,guide]
  return catchAsync(async (req, res, next) => {
    if (!rest.includes(req.user.role)) {
      return next(new APIError('u have No permission granted ', 401));
    }
    next();
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new APIError('Please Enter the email', 401));
  }
  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new APIError('User Not Found', 404));
  }
  const newToken = user.cryptoToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${newToken}`;
    const message = `Forgot your Password?? No problem...  Hit this link\n ${resetURL}`;

    await APIEmail({
      email: user.email,
      subject: 'your password reset token',
      message,
    });

    res.send({
      message: 'url has been sent',
      newToken,
    });
  } catch (error) {
    user.forgetCryptoToken = undefined;
    user.forgetCryptoTokenTime = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new APIError('Something wrong with email sender', 402));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await userModel.findOne({
    forgetCryptoToken: hashed,
    forgetCryptoTokenTime: { $gte: Date.now() },
  });
  if (!user) {
    return new APIError('Token invalid Or Expired', 401);
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.forgetCryptoToken = undefined;
  user.forgetCryptoTokenTime = undefined;

  await user.save();

  jwtAndRes(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).select('+password');
  const ok = await user.correctPassword(req.body.oldPassword, user.password);
  console.log(ok);

  if (!user || !(await user.correctPassword(req.body.oldPassword, user.password))) {
    return new APIError('Old password was incorrect!!💔', 401);
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordChangedAt = Date.now() - 1000;

  await user.save();

  res.status(200).send('Password Change was sucessfull');
});
