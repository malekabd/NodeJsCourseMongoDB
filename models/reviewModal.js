const mongoose = require('mongoose');
const Tour = require('./tourModel');
const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, 'Review can not be empty'] },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
    tour: {
      //this a parent referencing to the tour, the tour doesn't know about the review
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      //this a parent referencing to the user, the user doesn't know about the review
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
reviewSchema.pre(/^find/, function(next) {
  /*   this.populate({
    path: 'tour',
    select: 'name'
  }).populate({
    path: 'user',
    select: 'name photo'
  }); */
  this.populate({
    // we use this for so we don't end up repopulating the tour again in the reviews when we populate the review in the tour itself
    path: 'user',
    select: 'name photo'
  });
  next();
});
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    //we used a static method to call aggregate on the modal
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  console.log(stats);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating
  });
};

reviewSchema.post('save', function() {
  // this to call the static method
  this.constructor.calcAverageRatings(this.tour);
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
