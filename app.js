if(process.env.NODE_ENV != 'production'){
   require('dotenv').config();
}


const express=require('express');
const app=express();
const mongoose=require('mongoose');
const methodoverride=require("method-override");
const path=require('path');
const ejsmate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError.js');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const Localstrategy=require('passport-local');
const user=require('./modules/user.js');


const listingsRouter=require('./routes/listing.js');
const reviewsRouter=require('./routes/review.js');
const userRouter=require('./routes/user.js');


app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

const DB_URL=process.env.ATLAS_DB_URL;

const store=MongoStore.create({
    mongoUrl:DB_URL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
});

store.on('error',()=>{
    console.log('ERROR IN MONGO SESSION STORE',err);
})

const sessionoptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:1000*60*60*24*7,
        httponly:true
    }

}

app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  res.locals.currUser=req.user;
  next();
});

//connection with database
async function main(){
    await mongoose.connect(DB_URL);
}

main().then(()=>{
    console.log('connection succesfull');
})
.catch((err)=>{
    console.log(err);
}); // connection part end here


app.listen(8080,()=>{
    console.log('post is listening');
});


app.use('/listings',listingsRouter);
app.use('/listings/:id/reviews',reviewsRouter);
app.use('/',userRouter);


app.get('/demouser',async(req,res)=>{
    let fakeuser=new user({
        email:'abc@gmail.com',
        username:'abc'
    });

   let re=await user.register(fakeuser,'password');
   res.send(re);
})

//page Not found Middleware
app.use((req,res,next)=>{
   next(new ExpressError(404,"Page Not Found"));
});

//Error Handler MiddleWare
app.use((err,req,res,next)=>{
    let{statuscode=500,message='Something went error'}=err;
    res.status(statuscode).render('Error.ejs',{message});
    
});

