const catchAsync = require('../utils/catchAsync');
const reviewModal = require('./../Model/reviewModal');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await reviewModal.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await reviewModal.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
