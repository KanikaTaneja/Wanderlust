const user = require("../models/user");

module.exports.renderSignupForm = async (req,res)=>{
res.render("users/signupForm.ejs");
};

module.exports.signup = async (req,res)=>{
    try{
        let { email , username , password } = req.body;
        const newuser = new user({ email, username });
        const registereduser =  await user.register(newuser , password);
        console.log(registereduser);
        //this is a automatic login after one has sign up to the website
        req.login(registereduser , (err)=>{
            if(err){
            return next(err);
            }
            req.flash("success" , "Welcome to Wanderlust !");
            res.redirect("/listings");
        })
       
    } catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
 res.render("users/login.ejs");
}

module.exports.login = async (req,res)=>{
        req.flash("success" , " welcome to Wanderlust");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
       if(err){
       return next(err);
       }
       req.flash("success" , "you are successfully logged out");
       res.redirect("/listings");
    })
}