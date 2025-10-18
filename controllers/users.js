const User = require("../models/user.js");

//Render Signup Form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
}

// SignUp
module.exports.signUp = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      
      //Direct login after signup
      req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "User Registered Successfully");
        res.redirect("/listings");
      })
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
}

//Render Login Form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
}

//Authenticate the User
module.exports.authenticateUser = (req,res)=>{
        req.flash("success", "Welcome back to Stayomi");
        let redirectUrl = res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl);
}

//Logout user
module.exports.logoutUser = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Logged out successfully");
        return res.redirect("/listings");
    })
}

