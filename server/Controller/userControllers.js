const userModel = require('../Model/userModel');
const catchAsync = require('../utils/catchAsync');
const APIError = require('../utils/APIError');

exports.getAllUser = catchAsync(async (req, res, next) => {
  const data = await userModel.find();
  res.status(200).send({
    message: 'sucesses',
    data,
  });
});
exports.getByID = catchAsync(async (req, res, next) => {
  const data = req.params.id;
  console.log(data);
  const actualData = await userModel.findById(data);

  if (!actualData) {
    return next(new APIError('The Id is not valid', 404));
  }
  res.status(200).json({
    message: 'sucesses',
    actualData,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, { active: false });

  res.send({
    data: null,
  });
});
