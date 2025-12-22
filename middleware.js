// here this is used for the login authentication

const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req,res,next) => {
    // Check if the user is NOT logged in
    if(!req.isAuthenticated()){  //
        req.session.redirectUrl = req.originalUrl;  //req.originalUrl This property stores the full URL that the user originally tried to visit
        // req.session.redirectUrl This line saves that URL (/listings/123/edit) inside the session object.


        // Show an error message saying "you must be logged in to create listing!"
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/Login");
        //the return stops the function right there — it doesn’t execute the next line.So after redirecting, the function ends immediately, and it won’t try to render new.ejs.
    } 
    next();
}

//to sava the redirect we will create new middleware as passport dont have the access to delete from local so we will store the url in he local

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl; //res.locals is an object attached to the response
    }
    next();
}

module.exports.isOwner = async (req,res,next) => { //this is the middleware which help in checking the user and the 
    let {id} = req.params;
    let listing = await Listing.findById(id); //here we are accessing only the listingid
    if(!listing.owner.equals(res.locals.currUser._id)){  //if listing owner and cueeuser are not same then print error message while editing.
        req.flash("error", "you are not the Owner of the listing");
        return res.redirect(`/Listings/${id}`);
    }
    next(); //it is very important to call a next funtion otherwise it the page will not do its next move
}

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next() 
    }
};


// Middleware to validate review data using reviewSchema before saving it
// Middleware: validate review data with Joi schema.
// If invalid → throw error, else → call next() to continue.
module.exports.validateReview = (req,res,next) => {
    // Validate incoming request data against reviewSchema and extract any validation error
    // let {error} Destructure 'error' from the object returned by Joi validation

    let {error} = reviewSchema.validate(req.body);

    if(error) {
        // Collect all Joi validation error messages into a single string
        //error.details = array of all problems Joi found. el.message = human-readable message for each problem.
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next() 
    }
};


module.exports.isreviewAuthor = async (req,res,next) => { //this is the middleware which help in checking the user and the 
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId); //here we are accessing only the review id
    if(!review.author.equals(res.locals.currUser._id)){  //if listing owner and cueeuser are not same then print error message while editing.
        req.flash("error", "you are not the author of the review");
        return res.redirect(`/Listings/${id}`);
    }
    next(); //it is very important to call a next funtion otherwise it the page will not do its next move
}