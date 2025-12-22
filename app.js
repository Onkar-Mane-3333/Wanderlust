if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

// console.log(process.env.SECRET); //it access the secret key value from the .env file

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
// const listings = require("./models/review.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport"); //it is authentication middleware
const LocalStrategy = require("passport-local"); //it is one of the strategy of passport
const User = require("./models/user.js"); //we require the schema for the user


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main().then(res => {
    console.log("connection successful")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
};





const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //it is used to set the expiry date to the cookie.
        maxAge: 7* 24 * 60 * 60 * 1000,
        httpOnly: true,  // it is used to save from cross scripting atacks
    }
};

// app.get("/", (req,res) => { //main root
//     res.send("HI, I am root");
// });



app.use(session(sessionOptions));
app.use(flash()); // it is used to flash the message when you registered, review. now we will use this flash where we are creating any route in listing.js and inr review.js

// Adds Passport’s functionality into the middleware stack. Without this, Passport won’t work.
app.use(passport.initialize());
// Tells Passport to use session cookies to keep users logged in between requests.
// Works only if you’re also using express-session.
app.use(passport.session());
// Purpose: Tells Passport how to authenticate users.
// LocalStrategy:
// This is a strategy for username + password authentication (local login).
// You could have other strategies like Google OAuth, JWT, etc.
// User.authenticate():
// If you are using Mongoose with passport-local-mongoose, this method is automatically added to your User model.
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());//it is used to store the user information in session after login
passport.deserializeUser(User.deserializeUser());//it is used to remove the store  user information in se


app.use((req,res,next) => {
    //res.locals is an object provided by Express.
    //Anything you attach to res.locals becomes available to all your templates (views).
    res.locals.success = req.flash("success");
    //req.flash("success"). This retrieves any flash messages of type "success" that were previously set
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // here the value of req.user which store the data in the session 
    next();
});

// Route handler for GET request to "/demouser"
// app.get("/demouser", async(req,res) => {
//     // Create a new User object with email and username
//     // This object is not yet saved to the database
//     let fakeUser = new User({
//         email: "Student@gmail.com",
//         username: "delta-student"
//     });
//      // Register the new user with a password
//     // User.register() is provided by passport-local-mongoose
//     // It does two things:
//     // 1. Hashes the password securely
//     // 2. Saves the user (fakeUser) with hashed password into the database
//     let registerUser = await User.register(fakeUser, "helloworld"); //register is the method of user and here we have used fakeUser to store in the database and then stored password.
//     //register will automaticaly checks if the username is unique.

//     res.send(registerUser);
// })



// Mount listings router: all routes under /Listings
app.use("/Listings", listingRouter);

app.use("/Listings/:id/reviews",reviewRouter);  // /Listings/:id/reviews this is parent route and the child route will be in reviews
app.use("/", userRouter); //Mount all routes from userRouter starting at the root URL /.”
                           // So routes like /signup or /login defined inside userRouter become available directly in your app.


                           
// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing({
//         title:"My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

// app.use((err,req,res,next) => {
//     res.send("Something went wrong");
// });

app.use((req,res,next) => { //this is the route where route name will be different from above given route will be executed.
    next(new ExpressError(404 , "Page Not Found"));
});

//In Express, an error handler is just a special kind of middleware that has 4 arguments:
// Global error handler: catches any thrown ExpressError (or other errors)
// and shows error page with status code + message
app.use((err,req,res,next) => {  
    let {statusCode= 500 , message="Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message});
});


app.listen(8080 , () => {
    console.log("Listening at the port 8080");
});