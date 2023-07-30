const tourModel = require('../Model/tourModal');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  const tour = await tourModel.find();

  res.status(200).render('overview', {
    title: 'All tours',
    tour,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const tour = await tourModel.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
    tour,
  });
});
