const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');

// dotenv.config(); 
require('dotenv').config();

 
require('./db/conn'); 
app.use(express.json());
app.use(cookieParser()); 
const User = require('./model/userSchema');


app.use(require('./router/auth'));

const PORT = process.env.PORT||5000;








// app.get('/about',(req,res)=>{
//     res.send("About Page");
// })

// app.get('/contact',(req,res)=>{
//     res.cookie("Test","Rahul");
//     res.send("Contact Page");
// })

app.get('/signin',(req,res)=>{
    res.send("Signin Page");
})

app.get('/signup',(req,res)=>{
    res.send("Signup Page");
})

app.listen(PORT,()=>{
    console.log(`Server started on ${PORT}`);
})