///////////////////////////////        modules and packages     /////////////////////////////////////
const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');



///////////////////////////////        app uses     /////////////////////////////////////
const app=express();
app.use(bodyParser.json());
require('dotenv').config({path: "./config.env"});



///////////////////////////////        database connection     /////////////////////////////////////
require('./db/connection.js');
// model import
const User=require('./model/user');
const Item=require('./model/item');



///////////////////////////////        GET requests     /////////////////////////////////////

// getting the menu
app.get('/menu', (req,res)=>{
    Item.find({},(err,val)=>{
        if(err){ throw err; }
        else{ res.json(val);}
    })
    .clone()
    .catch((err)=>{
        console.log("error in get / :"+err);
    })
});


// getting previous orders
app.get('/api/previousorders', async (req,res)=>{
    try{
        const authHeader=req.headers.autherization;
        const token=authHeader && authHeader.split(' ')[1]; // getting token from header
        const userVerification=jwt.verify(token, process.env.JWT_KEY); // verifying token
        
        const currentUser=await User.findOne({_id: userVerification.id}); // finding user(using ID) from the data derived by the token

        if(currentUser){
            const allorders=currentUser.orders;
            res.status(201).json({previousOrders : allorders}); // sending previous orders as response 
        }
    }
    catch(error){
        res.json({status: 'error', error: "failed to get order history"});
    }
});




///////////////////////////////        POST requests     /////////////////////////////////////

// register functionality
app.post('/register', async (req,res)=>{

    const {username, password: plainTextPassword}=req.body;
    if(!username || typeof(username)!=="string"){ // username validation
        return res.json({status: 'invalid username only use character or check if its empty'});
    }
    if(!plainTextPassword || typeof(plainTextPassword)!=="string"){ // password validation
        return res.json({status: 'invalid password only use character or check if its empty'});
    }
    if(plainTextPassword.length<6){ // password length validation
        return res.json({status: 'password too small'});
    }

    const password=await bcrypt.hash(plainTextPassword, 10); // salting password
    
    try{
        const response=await User.create({username,password});
        console.log(response); 
    }
    catch(error){
        if(error.code===11000){
            return res.json({status: 'username already exist'}); // in case of duplicate key
        }
        throw error;
    }
    res.json({status: 'ok'});
});

// login functionality
app.post('/login', async(req,res)=>{

    const {username, password}= req.body;
    const userMatched=await User.findOne({username}).lean();

    if(!userMatched){
        return res.json({status: 'error', error: 'invalid username'}); // when user not found
    }

    if(await bcrypt.compare(password, userMatched.password)){ // comparing password with encrypted password   
        const token=jwt.sign( {id: userMatched._id, username: userMatched.username} ,process.env.JWT_KEY); // generating token
        return res.json({status: 'ok', data: token}); // token sent to response
    }
    res.json({status: 'error', data: "invalid username/password"});
})


// order placing functionality
app.post('/api/placeorder', async (req,res)=>{
    const orderItems=req.body;
    if(orderItems.length<1){ // check for empty order placed
        return res.json({status: 'add some item'});
    }

    try{
        const authHeader=req.headers.autherization;
        const token=authHeader && authHeader.split(' ')[1]; // getting token from header
        const userVerification=jwt.verify(token, process.env.JWT_KEY); // verifying token

        
        const currentUser=await User.findOne({_id: userVerification.id}); // finding user(using ID) from the data derived by the token
        if(currentUser){
            const userOrderResponse=await currentUser.addOrders(orderItems); // function in user.js, to store the order placed
            await currentUser.save();
            res.status(201).json({message : "user orders saved"});

        }
    }
    catch(error){
        res.json({status: 'error', error: "order failed!"});
    }
});


///////////////////////////////        server running    /////////////////////////////////////

app.listen(3000, ()=>{
    console.log("server started in port 3000");
})