const User = require("../models/user");

module.exports.renderSignupForm = (req,res) =>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res) => {
    try{
        let {username , email, password} = req.body; //Extracts form data sent from the frontend.
        const newUser = new User({email, username}); //Creates a new Mongoose user object with email and username.
        const registeredUser = await User.register(newUser, password); //Hashes the password and saves the user in the database (Passport-local-mongoose handles this).
        console.log(registeredUser);
        req.login(registeredUser, (err)=> { //this is the passport inbuld login method which helps in automatic login after signup. as we have used the registeredUser which cont the user data and then callback function is been used 
            if(err){ //if the is any error then it will be sent to Express’s error-handling middleware.
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/Listings");
        })
    }catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs")
}

module.exports.login = async(req,res) => {  //passport.authenticate is the middleware which help in login
    req.flash("success","User logedin successfully, Welcome to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings" // here we have defined this variable because when we directly login then the islogedin is not been triggered so data is not stored in session and due to that the data is not store in the locals so we dont derict to any page after login so to handle it we have made this variable
    res.redirect(redirectUrl); //it will redirect to the url the user want to accesss but was send to first login so after login it will redirect to the page it wants to go
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);  // if there’s an error while logging out, pass it to Express’s error handler
        }
        req.flash("success", "you are logged out"); // show success message
        res.redirect("/Listings"); // send the user back to the listings page
    });
}