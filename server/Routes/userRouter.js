const authController = require('../Controller/authController');
const userController = require(`${__dirname}/../Controller/userControllers`);
const express = require('express');
const userRouter = express.Router();

userRouter.get('/', userController.getAllUser);
userRouter.delete('/deleteMe', authController.protectRoutes, userController.deleteUser);
userRouter.get('/:id', userController.getByID);

userRouter.post('/sign-up', authController.signIn);
userRouter.post('/log-in', authController.logIn);
userRouter.post('/forgotPassword', authController.protectRoutes, authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.protectRoutes, authController.resetPassword);
userRouter.patch('/updatePassword', authController.protectRoutes, authController.updatePassword);

module.exports = userRouter;
