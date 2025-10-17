const mongoose=require('mongoose');
const initdata=require('./data.js');
console.log(initdata)
const Listing=require("../modules/lsiting.js");

const mongoUrl='mongodb://127.0.0.1:27017/wanderlust';

//connection with database
async function main(){
    await mongoose.connect(mongoUrl);
}

main().then(()=>{
    console.log('connection succesfull');
})
.catch((err)=>{
    console.log(err);
}); // connection part end here

const savedata=async ()=>{
    await Listing.deleteMany({});
   initdata.data= initdata.data.map((obj)=>(
    {
        ...obj,
        owner:'68edec43c94c739ae288064b'
    }
   ))
    await Listing.insertMany(initdata.data);
    console.log('data saved');
}

savedata();
