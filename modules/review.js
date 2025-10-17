const { number, date } = require('joi');
const mongoose=require('mongoose');
const schema=mongoose.Schema;

const reviewSchema=new schema({
    Comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    cretedAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports=mongoose.model('review',reviewSchema);

