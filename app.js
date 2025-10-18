if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const { title } = require("process");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schemaValidation.js");
const Review = require("./models/reviews.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method")); 
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

//DataBase Url to connect
const dbUrl = process.env.ATLASDB_URL;
main()
.then(() =>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

//Used to Store the Session in MongoStore
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
})

store.on("error", ()=>{
    console.log("Some error in the MONGO STORE ", err);
})

//To store the session options as a object
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
}



//Using sesssion to handle the state
app.use(session(sessionOptions));

//Using connect-flash
app.use(flash());

//Using passport for Authentication and Authorization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());









app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


//Listings Route
app.use("/listings", listingRouter);
///Review route
app.use("/listings/:id/reviews", reviewRouter);
//Signup route
app.use("/", userRouter);


app.all("*", (res, req, next)=>{
        next(new ExpressError(404, "Page not found"));
})

//Error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message});
})

app.listen(8080, () =>{
    console.log("Listening to the app at port 8080")
})