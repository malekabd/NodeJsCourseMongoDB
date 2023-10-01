const Review = require('./../models/reviewModal');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  if (!reviews) next(new AppError('No ', 400));
  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews
    }
  });
});
exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  });
});