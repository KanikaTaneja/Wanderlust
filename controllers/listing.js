const listing = require("../models/listing.js");
const axios = require("axios");
const mapToken =  process.env.MAP_TOKEN ;
console.log("MAP_TOKEN:", process.env.MAP_TOKEN);

async function geocode(location) {
  const response = await axios.get(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json`,
    {
      params: {
        key: mapToken,
        limit: 1
      }
    }
  );
  return response.data;
}

module.exports.index = async (req,res)=>{
    const listings =  await listing.find({});
    res.render("listings/index.ejs" , {listings});
};

module.exports.renderNewForm = async (req,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req,res)=>{
   let{ id } = req.params;
   const listingdata =  await listing.findById(id)
   .populate({
      path:"reviews",
      populate:{
        path:"author",
      },
   }) //  to get all  the info of reviews
   .populate("owner"); // to get all  the info of owner
   
    const geoData = await geocode(listingdata.location);
  const coordinates = geoData.features[0].geometry.coordinates;

   if(!listingdata){
    req.flash("error" , "listing u requested for , doesn't exist");
    return res.redirect("/listings");
   }
   console.log(listingdata);
   res.render("listings/show.ejs" , { listing : listingdata});
};

module.exports.createListings = async (req,res,next)=>{

    const geoData = await geocode(req.body.listing.location);
    console.log(geoData.features[0].geometry);

      let url = req.file.path;
      let filename = req.file.filename;

      const newlisting = new listing(req.body.listing);     //req.body.listing is a js object
      newlisting.owner = req.user._id; //passport bydefault user ki info store krta hai
      newlisting.image = { url , filename};
      newlisting.geometry = geoData.features[0].geometry;
      
     let savedlisting = await newlisting.save();
     console.log(savedlisting);
      req.flash("success" , "new listing created"); // key-mssg pair 
      res.redirect("/listings");
};

module.exports.renderEditForm =  async (req,res)=>{
 let{ id } = req.params;
  const listingdata =  await listing.findById(id );
  if(!listingdata){
    req.flash("error" , "listing u requested for , doesn't exist");
    return res.redirect("/listings");
   }
  let originalImageURL =  listingdata.image.url;
  originalImageURL.replace("/upload" , "/upload/h_300,w_250")
  res.render("listings/edit.ejs" ,  { listing : listingdata , originalImageURL});
};

module.exports.updateListing= async (req,res)=>{
    let{ id } = req.params;
    let updatedListing = await listing.findByIdAndUpdate(id  , {...req.body.listing});

      if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    }
    
      req.flash("success" , "Listing updated");
      res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res)=>{
 let{ id } = req.params;
 let deletedlisting = await listing.findByIdAndDelete(id);
 console.log(deletedlisting);
 req.flash("success" , "Listing deleted");
 res.redirect("/listings");
}
