if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const model = require("./models/listing.js");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Expresserror = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const session = require("express-session");
const { MongoStore } = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");
const helmet = require("helmet");

const dbURL = process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl : dbURL,
  crypto :{
    secret:process.env.SECRET,
  },
  touchAfter:24*60*60,
});
store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORED", err);
});

const sessionoperations = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie :{
    expires : Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  }
}
app.use(session(sessionoperations));
app.use(flash());

// Modify your helmet initialization to turn off the strict content policy blocker
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate())); // passport ke andar jo sare user aayenge vo sare local strategy ke throught authenticate(signup ya login) hone chahiye 
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{   // middleware for flash 
  // in locals wale variables ko khain bhi use kr sakte hain
  res.locals.listingaddedmssg = req.flash("success");  // listingaddedmssg is a variable iska use flash.ejs me use kiya hai
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user; // stores info of current user
  
  next(); // don't forget
})

const listingRouter = require("./router/listing.js");
const reviewRouter = require("./router/review.js");
const userRouter = require("./router/user.js");

const Joi = require('joi');
const { listingSchema , reviewSchema} = require("./schema.js");
const review = require("./models/review.js");

app.engine('ejs', ejsMate);

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "utils/views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname , "/public")));


main()
.then(()=> console.log(" connected to db") )
.catch(err => console.log(err));

async function main() {
  // await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  await mongoose.connect(dbURL);
}

// app.get("/demouser" ,async (req,res)=>{
//   let fakeuser =new user({
//     email:"fakeuser@gmail.com",
//     username:"fakeuser"
//   });
//  let registereduser = await user.register(fakeuser , "holllaa"); // holllaa is the password
//  res.send(registereduser);
// })

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);

app.use((req, res , next) => {
  next(new Expresserror(404,'Page not found'));
    //res.status(404).send('Page not found');
});

app.use((err, req, res, next) => {
  let { status=500 , message="some error occured"} = err;
  // res.status(status).send(message);
  res.status(status).render("listings/error" , {err});
});

app.listen(3000 , (req,res)=>{
console.log(" server 3000 is working");
});