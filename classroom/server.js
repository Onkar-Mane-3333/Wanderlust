const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const flash = require("connect-flash");
const path = require("path"); //It gives the absolute path of the views folder no matter where your code is run.
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

//this was all about the cookie
// const cookieParser = require("cookie-parser"); // cookie-parser is npm package and it helps in parsing the cookies.
const session = require("express-session");

const sessionOptions =  {
    secret: "mysupersecretstring", resave:false, saveUninitialized: true,
    
};

app.use(session(sessionOptions));  //this is the use of express-session to sign the cookie.  resave is been used to save the data to the temp storate in the server
app.use(flash());

app.use((req,res,next) => {
     res.locals.successMsg = req.flash("success"); //we are sending the success key in a flash . req.flash("success") Retrieves all flash messages stored under the key "success".
//     res.locals is an object that is available to all EJS (or other template engine) files rendered in that request.
// By assigning res.locals.success, you make that flash message accessible inside your EJS template.
    res.locals.errorMsg = req.flash("error"); //we are sending the success key in a flash
    next();
});

// Enables the use of flash messages. 
// Flash messages are temporary messages stored in the session and are typically used to display 
// success or error notifications after a redirect (e.g., "User registered successfully").

app.get("/register", (req,res) => {
    let {name = "anonymous"} = req.query; //it is trying to store the query in the url. ?name=onkar 
    // Extracts 'name' from the query string in the URL.
    // Example: /register?name=onkar → name = "onkar"
    // If 'name' is not provided, it defaults to "anonymous".
    req.session.name = name; //here the name is been stored in the session
     // Stores the 'name' in the session so it can be accessed later in other routes.
    // Sessions persist user data between different requests.
    
    if(name === "anonymous"){
        req.flash("error", "user not registerd");
    }else{
        req.flash("success", "user registered successfully");  //req.flash() comes from a middleware called connect-flash, which is commonly used with Express.js.It is used to store temporary messages (called flash messages) in the session — usually for showing success or error messages after a redirect.
    }
    // Creates a flash message with the key "success".
    // This message is stored temporarily in the session and can be retrieved on the next request.
    res.redirect("/hello");
    // Redirects the user to the '/hello' route after registration.
    // The flash message will be available on that redirected page.
});

app.get("/hello", (req,res) => {
    //console.log(req.flash("success")); // here we are accessing the value with the help of key
     // Retrieves and clears the flash message with the key "success".
   
    res.render("page.ejs",{name: req.session.name}); // “render” means:Take a template file (like .ejs, .pug, or .hbs),fill it with data,and convert it into final HTML to send to the browser.
    // Renders the 'page.ejs' template and passes the session name as a variable.
    // Inside page.ejs, you can access it using <%= name %>.
 
    //res.send(`hello, ${req.session.name}`); // there the different page data will we shown to the page. data will be displayed.
});

//  req.session.count This is a custom variable stored inside the session object for each user.
// req.session is an object.
// You can store anything in it — strings, numbers, objects, etc.
// This keeps track of how many times that specific user has visited /reqcount since their session started.
// Every time they refresh or send a new request to /reqcount, the count increases.
app.get("/reqcount", (req,res) => {
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1;
    }
    res.send(`you send a request ${req.session.count} times`);
});

// app.get("/test", (req,res) => { 
//     res.send("test succesfull");
// });






// // app.use(cookieParser()); //it is the middleware and any request first goes through this cookieparser middleware
// app.use(cookieParser("secretcode")); // it is the secretcode in the form of string to keep the cookie secure

// app.get("/getsignedcookies", (req,res) => {
//     res.cookie("Made-In", "India", {signed: true}); //here signes:true means the cookie s been signed
//     res.send("Signed cookie send");
// });

// app.get("/verify", (req,res) => {
//     console.log(req.signedCookies); //it is used to get the signedcookies.
//     res.send("verified");
// });

// app.get("/getcookies", (req,res) => {
//     res.cookie("greet", "hello"); //here cookie method is used to send cookies with the help of express and in cookies there is name- value pair
//     res.send("Send you some cookies");
// });

// app.get("/greet", (req,res) => {
//     let{name = "anonymous"} = req.cookies; //accessing the coookie with name as we have the name cookie and if the ccokie is not present then we have 
//     res.send(`Hi, ${name}`); //here in the grret page we will be shown the value of name.
// });

// app.get("/" ,(req,res) => {
//     console.dir(req.cookies);
//     res.send("Hi, I am root");
// });

// app.use("/users", users); //For any incoming request that starts with /users, use the router object users to handle it."
// app.use("/posts", posts);


app.listen(3000 , () => {
    console.log("server is listening to 3000");
});