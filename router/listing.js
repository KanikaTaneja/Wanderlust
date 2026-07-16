const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema , reviewSchema} = require("../schema.js");
const Expresserror = require("../utils/ExpressError.js");
const model = require("../models/listing.js");
const listing = require("../models/listing.js");
const {isloggedIn, isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});



router
.route("/")
.get(wrapAsync (listingController.index))
.post(
   isloggedIn ,
   upload.single('listing[image]') , 
   validateListing ,
   wrapAsync (listingController.createListings)
)


// new route
router.get("/new" ,isloggedIn , wrapAsync (listingController.renderNewForm));

router
.route("/:id")
.put(
  isloggedIn ,
  isOwner ,
  upload.single('listing[image]') ,
  validateListing ,  
  wrapAsync (listingController.updateListing)
)
.delete(
  isloggedIn ,
  isOwner,
  wrapAsync (listingController.deleteListing)
)
.get( wrapAsync (listingController.showListings))

//edit route
router.get("/:id/edit" ,
  isloggedIn ,
  isOwner,
  wrapAsync (listingController.renderEditForm)
);

//alternative to our previous method

// // index route
// router.get("/" , wrapAsync (listingController.index));

// // create route
// router.post("/" ,
//    isloggedIn ,
//    validateListing , 
//    wrapAsync (listingController.createListings)
// );


//update route
// router.put("/:id" ,
//   isloggedIn ,
//   isOwner ,
//   validateListing ,  
//   wrapAsync (listingController.updateListing));

// show route 
// router.get("/:id" , wrapAsync (listingController.showListings));

// delete route
// router.delete("/:id" ,
//   isloggedIn ,
//   isOwner,
//   wrapAsync (listingController.deleteListing)
// );




module.exports = router;