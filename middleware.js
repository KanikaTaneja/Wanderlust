const listing = require("./models/listing.js");
const review = require("./models/review.js");
const { listingSchema , reviewSchema} = require("./schema.js");
const Expresserror = require("./utils/ExpressError.js");
module.exports.isloggedIn = (req,res,next)=>{
    console.log(req); // all details related req 
    console.log(req.user);
    
    if( !req.isAuthenticated() ){
        // redirecturl saved
        req.session.redirectUrl = req.originalUrl ;
        console.log(req.path , ".." , req.originalUrl);
         // originalUrl is the url we want to redirect to after login
        req.flash("error" , "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}
  // ye middleware isliye banya ki isse phele jb hum add listing me jaare the bina sign up 
  // kiye to phele humse login mange re or login krne ke baad hum /listings me redirect ho 
  // jaare the...or hume vo nhi chachiye the we want...yahn hum jo krre the usei page me 
  // vapis aaye login ke baad nah ki /listings pe
module.exports.saveRedirectUrl = (req,res,next)=>{
    if( req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
 

module.exports.isOwner =async (req,res,next)=>{
    let{ id } = req.params;
    let listingID =await listing.findById(id);
    if( !listingID.owner.equals(res.locals.currentUser._id)){ // so that the owner only can make changes
      req.flash("error" , " you are not the owner of the listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) =>{
  let {error} = listingSchema.validate(req.body);
   if(error) {
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new Expresserror(404 , errMsg);
  } else {
    next();
  }
}

module.exports.validateReview = (req,res,next) =>{
  let {error} = reviewSchema.validate(req.body);
   if(error) {
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new Expresserror(404 , errMsg);
  } else {
    next();
  }
}

module.exports.isReviewAuthor =async (req,res,next)=>{
    let{ id,reviewid } = req.params;
    let reviewID =await review.findById(reviewid);
    if( !reviewID.author.equals(res.locals.currentUser._id)){ // so that the owner only can make changes
      req.flash("error" , " you are not the author of the review");
      return res.redirect(`/listings/${id}`);
    }
    next();
}