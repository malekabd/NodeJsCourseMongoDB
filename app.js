const express = require('express');
const morgan = require('morgan'); // it returns the same code of normal middleware

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1. MiddleWares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev '));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  // a new middleware
  console.log('Hello');
  next();
});
app.use((req, res, next) => {
  // a new middleware
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//4. Start Server

module.exports = app;
