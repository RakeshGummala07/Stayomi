const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schemaValidation.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {cloudinary, storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//Middleware for validation
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

router.route("/")
//Read all Data (Index Route)
.get( wrapAsync(listingController.index))
//Create route
.post(
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.createNewListing)
)

//New Route
router.get("/new", isLoggedIn, listingController.renderNewFrom);


router.route("/:id")
//Show Route
.get(wrapAsync(listingController.showListing))
//Update Route
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing)
)
//Delete route
.delete( isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))



//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;
