const user=require('../modules/user.js');

module.exports.renderSignupForm=(req,res)=>{
    res.render('../views/user/signup.ejs');
};

module.exports.signup=async(req,res)=>{
try{
    let {username,email,password}=req.body;
    const newuser=new user({username,email});
    let registeredUser= await user.register(newuser,password);

    req.login(registeredUser,(err)=>{
    if(err){
        return next(err);
    }
    req.flash('success','Welcome To Wanderlust!');
    let redirectUrl=res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
    });
}
catch(e){
    req.flash('failure',e.message);
    res.redirect('/signup');
}
}

module.exports.renderLoginForm=(req,res)=>{
    res.render('../views/user/login.ejs')
};

module.exports.login=async(req,res)=>{
    req.flash('success','welcome back to wanderlust!.you are logged in!');
    let redirect1=res.locals.redirectUrl || '/listings';
    console.log(redirect1);
    res.redirect(redirect1);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','You are logged out!');
        res.redirect('/listings');
    })
};
