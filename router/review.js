const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema} = require("../schema.js");
const Expresserror = require("../utils/ExpressError.js");
const model = require("../models/listing.js");
const review = require("../models/review.js");
const listing = require("../models/listing.js");
const { validateReview,  isloggedIn, isOwner, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// Review Review route
//Post Route
router.post("/" ,
  isloggedIn,
  validateReview ,
  wrapAsync(reviewController.createReview)
);

//Delete Review Route
router.delete("/:reviewid" ,
  isloggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;