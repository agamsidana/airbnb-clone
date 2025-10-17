const Listing=require("../modules/lsiting.js");
require('dotenv').config();
let apikey=process.env.API_kEY;


module.exports.index=async (req,res)=>{
    const alldata= await Listing.find({});
    res.render('./listings/index.ejs',{alldata});
};

module.exports.RenderNewForm=(req,res)=>{
    res.render('./listings/new.ejs');
};

module.exports.createListing=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let newlisting=new Listing(req.body.listing);

try{
    let address=newlisting.location;
    let encodedaddress=encodeURIComponent(address);
    let response=await fetch(`https://us1.locationiq.com/v1/search?key=${apikey}&q=${encodedaddress}&format=json`);
    let data=await response.json(); 

    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    newlisting.geometry={
        type:'point',
        coordinates:[data[0].lon,data[0].lat]
    }
}

catch{
  console.log(err);
  req.flash('error',"Try again later");
}

    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();

    console.log(newlisting);

    req.flash('success',"New Listing is Created!");
    res.redirect('/listings');
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listings=await Listing.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
    if(!listings){
        req.flash('error',"The Listing You Request For Does't exists");
        return res.redirect('/listings');
    }
    res.render('./listings/show.ejs',{listings})
};

module.exports.renderEditForm=async (req,res)=>{
    let{id}=req.params
    const data= await Listing.findById(id);
    if(!data){
        req.flash('error',"The Listing You Request For Does't exists");
        return res.redirect('/listings');
    }
    let originalImageUrl=data.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render('./listings/edit.ejs',{data,originalImageUrl});
}

module.exports.updateListing=async (req,res)=>{
    let{id}=req.params;
   let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file!='undefined'){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
   }

    req.flash('success',"Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success',"Listing Deleted!");
    res.redirect('/listings')
}
