const express = require('express');
const router = express.Router();
const reviewController = require('../Controller/reviewController');
const authController = require('../Controller/authController');

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protectRoutes,
    authController.permission('user'),
    reviewController.createReview
  );

module.exports = router;
