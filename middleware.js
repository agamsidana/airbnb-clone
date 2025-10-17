const Listing=require('./modules/lsiting.js');
const {listingschema}=require('./Schema.js');
const ExpressError=require('./utils/ExpressError.js');
const {reviewschema}=require('./Schema.js');
const Review=require("./modules/review.js");

module.exports.isloggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash('error','You must be logged in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req .flash('error',"you are not the owner of this listing");
        return res.redirect('/listings');
    }
    next();
}

module.exports.validateSchema=(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
    if(error){
        throw new ExpressError(400,error)
    }
    else{
        next();
    }
}

module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewschema.validate(req.body);
    if(error){
        throw new ExpressError(400,error)
    }
    else{
        next();
    }
}

module.exports.isReveiwAuthor=async (req,res,next)=>{
    let {id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req .flash('error',"you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
