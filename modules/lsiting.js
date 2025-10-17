const mongoose=require('mongoose');
const schema=mongoose.Schema;
const Review=require('./review.js');
const { string } = require('joi');

//listing Schema
const listingSchema=new schema({
    title:{
       type:String,
       required:true,
    },
    description:String,
    image:{
      url:String,
      filename:String
    },
    price:{
      type:Number,
      min:100
    },
    location:String,
    country:String,
    reviews:[
      {
        type:schema.Types.ObjectId,
        ref:"review"
      }
    ],
    owner:{
      type:schema.Types.ObjectId,
      ref:'User'
    },
    geometry:{
      type:{
        type:String,
        enum:['point'],
        required:true
      },
      coordinates:{
        type:[Number],
        required:true
      }
    }
}); //Listing Schema end--

// moongose middleware
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
  await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;
