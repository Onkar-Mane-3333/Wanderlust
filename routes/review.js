const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isreviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//Reviews
//post review Route
router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//delete review route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isreviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;

// Express Router:
// - A "mini-app" inside your main Express app
// - Used to organize routes into separate files (e.g., listings, reviews)
// - Can have its own routes and middleware
// - Created with: const router = express.Router();
// - Export the router and mount it in app.js with app.use("/path", router)
// Example:
//   router.get("/", ...)      // handles GET /path
//   router.post("/", ...)     // handles POST /path
