const mongoose=require("mongoose");

const DBURL=process.env.DATABASE;

mongoose.set('strictQuery', true);
mongoose.connect(DBURL, {useNewUrlParser: true} )
.then(()=>{
    console.log("successfully connected to database");
})
.catch((err)=>{
    console.log("couldn't connect to database "+err);
});