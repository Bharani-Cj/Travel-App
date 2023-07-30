const tourControllers = require('../Controller/tourControllers');
const authController = require(`./../Controller/authController`);
const express = require('express');
const router = express.Router();

router.route('/').get(tourControllers.getMethod);
router
  .route('/:id')
  .get(tourControllers.getByID)
  .delete(
    authController.protectRoutes,
    authController.permission('admin', 'guide'),
    tourControllers.deleteByID
  );
router.route('/post').post(tourControllers.postTour);
router.route('/easy/top-5-cheap').get(tourControllers.topCheap, tourControllers.getMethod);
router.route('/aggri').get(tourControllers.aggr);

module.exports = router;
