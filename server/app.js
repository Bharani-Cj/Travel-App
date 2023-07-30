const tourRouter = require('./Routes/tourRoutes');
const viewRouter = require('./Routes/viewRoutes');
const reviewRouter = require('./Routes/reviewRoutes');
const path = require('path');
const userRouter = require('./Routes/userRouter');
const APIError = require('./utils/APIError');
const globalErrorHandling = require('./Controller/globalErrorHandler');
const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// setting view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// serving static file
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', viewRouter);
app.use('/api/v1/travels', tourRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/review', reviewRouter);

app.all('*', (req, res, next) => {
  next(new APIError('This Route is not defined', 404));
});

app.use(globalErrorHandling);

module.exports = app;
