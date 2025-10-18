const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
//Get Signup From
.get(userController.renderSignupForm)
//Post new listing
.post(
  wrapAsync(userController.signUp)
);


router.route("/login")
//Login
.get( userController.renderLoginForm)
//Authenticate the user 
.post(
  saveRedirectUrl, 
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.authenticateUser
); 

router.get("/logout",userController.logoutUser)

module.exports = router;
