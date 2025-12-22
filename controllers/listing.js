const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings, categoryName: null });
};


module.exports.renderNewForm = (req,res) =>{
    //console.log(req.user); //req.user is automatically created by Passport.js after a user logs in successfully.req.user usually contains the user’s data fetched from your database
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate: {path: "author"},}).populate("owner");  //with this populate you get the whole object of the review on the page
    if(!listing){  //this is used to give the error message when you want to access listing is not present
        req.flash("error","Listing you want to access does not exist");
        return res.redirect("/Listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async (req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    // if(!req.body.listing){  //this error occurs when the data is not send properly and it is the fault of the user.
    //     throw new ExpressError(400 , "Send Valid Data For Listing");
    // }
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, error);
    // }
    // let (title, description , Image, price , Country, location) = req.body;
    const newlisting =new Listing(req.body.listing);  //we have made the object so we are fetching from req.body.listing
    newlisting.owner = req.user._id; //here we are storing the req.user._id in the owner
    newlisting.image = {url, filename}; //accessing the image 
    await newlisting.save();  //storing in the database
    // It’s a method provided by the connect-flash package.
    // It allows you to store temporary messages (called flash messages) in the user’s session
    //req.flash() is used to send a one-time message (like “Success!” or “Error!”) from one route to another.
    req.flash("success", "New Listing Created"); //here we are giving 
    // let listing = req.body.listing;
    // console.log(listing);
    res.redirect("/Listings");

}

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){  //this is used to give the error message when you want to access listing is not present
        req.flash("error","Listing you want to access does not exist");
        return res.redirect("/Listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", {listing , originalImageUrl});
}

module.exports.updateListing = async(req,res) => {  //isloggedIn is the middleware used for the validation    purpose if user is loggedin then only it can access the add new user or update the listing
    // if(!req.body.listing){
    //      throw new ExpressError(400 , "Send Valid Data For Listing");
    // }

    //They are values passed inside the URL path — often used to identify specific resources (like a user, listing, product, etc.).
    let {id} = req.params;
    // Spread operator (...) takes all key-value pairs from req.body.listing
    // and creates a new object. This way, each form field (title, price, etc.)
    // is passed individually to findByIdAndUpdate instead of nesting under "listing".
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // first we have updated the listing whole body part 
     if(typeof req.file !== "undefined"){ //it will check if the file contain the url and filename anf if they are present then only we save them
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename};
        await listing.save();
     }
    req.flash("success", "Listing Upated");
    res.redirect(`/Listings/${id}`);
    
}

module.exports.destroyListing = async(req,res) => {
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/Listings");
    console.log(deleteListing);
}

module.exports.filterByCategory = async (req, res) => {
  const { categoryName } = req.params;
  const allListings = await Listing.find({ category: categoryName });

  // If no listings found, show a friendly message
  if (allListings.length === 0) {
    req.flash("error", `No listings found for category: ${categoryName}`);
    return res.redirect("/listings");
  }

  // Render the same index page with filtered results
  res.render("listings/index.ejs", { allListings, categoryName });
};
