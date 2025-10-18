const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

//Post Route Controller
module.exports.postReview = async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author = req.user;
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}

//Delete Review Controller
module.exports.deleteReview = async(req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}