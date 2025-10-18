const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Index Route Controller
module.exports.index = async (req, res) => {
    const { q } = req.query;
    let filter = {};
    if (q) {
        filter = {
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { location: { $regex: q, $options: 'i' } },
                { country: { $regex: q, $options: 'i' } }
            ]
        };
    }
    let allListing = await Listing.find(filter);
    let count = allListing.length;
    if(count == 0){
      allListing =  await Listing.find();
      return res.render("listings/index.ejs", { allListing, q, count });
    } 
    res.render("listings/index.ejs", { allListing, q, count });
}

//New Route Controller
module.exports.renderNewFrom = async (req, res) => {
  res.render("listings/newListing.ejs")
}

//Show Route Controller
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate: {
      path : "author"
    }}).populate("owner");
    if (!listing) {
      req.flash("error", "listing does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

//Create Route Controller
module.exports.createNewListing = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
  .send()



    let url = req.file.path;
    let filename = req.file.filename;
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing");
    }
    const newListing = new Listing(req.body.listing); // Short hand for the above
    newListing.owner = req.user._id;
    newListing.image = {url, filename}
    newListing.geometry = response.body.features[0].geometry
    let savedListing = await newListing.save();

    req.flash("success", "New listing created");
    res.redirect("/listings");
}

//Edit Route Controller
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "The listing does not exist")
      return res.redirect("/listings");
    }
    let originalImgUrl = listing.image.url;
    originalImgUrl = originalImgUrl.replace("/upload", "/upload/h_250,w_250");
    console.log(originalImgUrl)
    res.render("listings/edit.ejs", { listing, originalImgUrl });
}

//Update Route Controller
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
  }
  req.flash("success", "Listing is updated");
  res.redirect(`/listings/${id}`);
}

//Delete Route Controller
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let dltdListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is deleted");
    res.redirect("/listings");
  }
