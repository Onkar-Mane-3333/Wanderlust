const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js"); //we require the islogged module This imports the code from the file middleware.js, which is in the parent folder (../ means “go one folder up”).
const {isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer'); //it is middlware used or uploading files
const {storage} = require("../cloudConfig.js");// here we are accessing the storage from cloudinary
const upload = multer({ storage }); //it is used for initialization purpose.and automaticaly store in the uploade file. now we are saving image in the cloudinary


router.route("/")         //router.route help in combing the same path route
.get(wrapAsync(listingController.index))  //index route
.post( isLoggedIn,upload.single('listing[image]'),validateListing , wrapAsync(listingController.createListing)) //create route . is a middleware provided by Multer, a popular Node.js library used to handle file uploads (like images) from HTML forms.


//New route
router.get("/new",isLoggedIn, listingController.renderNewForm);

// Category Filter Route
router.get(
  "/category/:categoryName",
  wrapAsync(listingController.filterByCategory)
);


router.route("/:id")
.get(wrapAsync(listingController.showListing)) //show route
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing)) //update route
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing)) //delete route

//index route
// router.get("/", wrapAsync(listingController.index)); //in this listingcontroller all the work when request comes is been written there.






//Show route
// router.get("/:id", wrapAsync(listingController.showListing));

//create route
// router.post("/", validateListing , wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

//update route
// router.put("/:id" ,isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));

//Delete Route
// router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;