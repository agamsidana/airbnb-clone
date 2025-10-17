const Listing=require("../modules/lsiting.js");
const Review=require("../modules/review.js");


module.exports.createReview=async (req,res)=>{
    const listing=await Listing.findById(req.params.id);
    const newreview=new Review(req.body.review);

    listing.reviews.push(newreview);
    newreview.author=req.user._id;

    await listing.save();
    await newreview.save();

    req.flash('success',"New Review Created!");

    res.redirect(`/listings/${listing._id}`);

};

module.exports.destroyReview=async(req,res)=>{
  let{id,reviewid}=req.params;

  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
  await Review.findByIdAndDelete(reviewid);

  req.flash('success'," Review Deleted!");

  res.redirect(`/listings/${id}`);
}