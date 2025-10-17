const express=require('express');
const router=express.Router();
const WrapAsync=require('../utils/WrapAsync.js');
const Listing=require("../modules/lsiting.js");
const { exists } = require('../modules/review.js');
const {isloggedIn,isOwner,validateSchema}=require('../middleware.js');
const multer=require('multer');
const{storage}=require('../cloudConfig.js');
const upload=multer({storage});


const listingController=require('../controllers/listings.js');

//Index and Create Route
router.route('/')
.get(WrapAsync(listingController.index))
.post(isloggedIn,upload.single('listing[image]'),validateSchema,WrapAsync(listingController.createListing));

// New Route
router.get('/new',isloggedIn,listingController.RenderNewForm);

// Show ,update and Delete Route
router.route('/:id')
.get(WrapAsync(listingController.showListing))
.put(isloggedIn,isOwner,upload.single('listing[image]'),validateSchema,WrapAsync(listingController.updateListing))
.delete(isloggedIn,isOwner,WrapAsync(listingController.destroyListing));

//Edit route
router.get('/:id/edit',isloggedIn,isOwner,WrapAsync(listingController.renderEditForm));

module.exports=router;
