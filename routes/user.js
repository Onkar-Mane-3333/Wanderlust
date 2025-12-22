const express = require("express");
const router = express.Router();
const User = require("../models/user"); //herer we  reuire the user model which is located in the ../models/user.
const wrapAsync = require("../utils/wrapAsync");
const passport= require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup))

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate('local', { failureRedirect:"/login", failureFlash:true}), userController.login)

// router.get("/signup", userController.renderSignupForm);

// router.post("/signup", wrapAsync(userController.signup));//User.register() is a prebuilt facility, but not from Passport itself —
// it comes from the passport-local-mongoose plugin that extends Passport’s functionality for Mongoose models.


// router.get("/login", userController.renderLoginForm);


//here we have used the saveRedirectUrl middleware to save the session redirectUrl in local as it is object.and can be acccessible in any views/template.
// router.post("/login",saveRedirectUrl,passport.authenticate('local', { failureRedirect:"/login", failureFlash:true}), userController.login);
//logout
router.get("/logout", userController.logout);


module.exports = router;