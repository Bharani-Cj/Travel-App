const APIError = require('../utils/APIError');
const catchAsync = require('../utils/catchAsync');
const testModel = require('../Model/tourModal');
const APIFeature = require('../utils/APIFeatures');

exports.topCheap = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getMethod = catchAsync(async (req, res, next) => {
  const features = new APIFeature(testModel.find(), req.query).filter().sort().limit().pagenation();
  const newfeature = await features.query;
  res.send({
    message: 'sucesses',
    length: newfeature.length,
    newfeature,
  });
});

exports.getByID = catchAsync(async (req, res, next) => {
  const data = req.params.id;
  const actualData = await testModel.findById(data);

  if (!actualData) {
    return next(new APIError('The Id is not valid', 404));
  }
  res.status(200).json({
    message: 'sucesses',
    length: 1,
    actualData,
  });
});

exports.postTour = catchAsync(async (req, res, next) => {
  let data = req.body;
  data = await testModel.create(data);
  res.status(200).json({
    status: 'SUCESSES',
    data,
  });
});

exports.deleteByID = catchAsync(async (req, res, next) => {
  const actualData = await testModel.findByIdAndDelete(req.params.id);
  if (!actualData) {
    return next(new APIError('The Id is not valid', 404));
  }
  res.status(200).json({
    message: 'sucesses',
  });
});

exports.aggr = async (req, res) => {
  const strap = await testModel.aggregate([
    {
      $match: { duration: 5 },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        count: { $sum: 1 },
        avgRatings: { $avg: '$ratingsAverage' },
      },
    },
  ]);
  res.send({
    message: 'sucesses',
    Length: strap.length,
    strap,
  });
};
