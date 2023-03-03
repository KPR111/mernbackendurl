const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
require('../db/conn');
const User = require('../model/userSchema');



router.get('/',(req,res)=>{
    res.send("Hello World");
})

// using promises
// router.post('/register',(req,res)=>{
//     // console.log(req.body);
//     // res.json({message:req.body});
//     const {name,email,phone,work,password,cpassword} = req.body;
//     if(!name || !email || !phone || !work || !password || !cpassword){
//         return res.status(422).json({error:"Please fill all the fields"});
//     }
//     User.findOne({email})
//     .then((userExist)=>{
//         if(userExist){
//             return res.status(422).json({error:"Email already exists"});
//         }
//         const user = new User({name,email,phone,work,password,cpassword});
//         user.save().then(()=>{
//             res.status(201).json({message:"User registered successfully"});
//         }).catch((err)=>res.status(500).json({error:"Failed to register"}));
//     }).catch(err=>{console.log(err);});

//     // res.json({message:"Registration Successful"});
    
// })

// using async await
router.post('/register',async (req,res)=>{
    const {name,email,phone,work,password,cpassword} = req.body;
    if(!name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({error:"Please fill all the fields"});
    }
    try{
        const userExist=await User.findOne({email:email});
        if(userExist){
            return res.status(422).json({error:"Email already exists"});
        }else if(password !== cpassword){
            return res.status(422).json({error:"Password are not matching"});
        }else{
            const user = new User({name,email,phone,work,password,cpassword});
            //beforing saving the data we have to hash the password for security purpose
            await user.save();
            res.status(201).json({message:"User registered successfully"});
        }

    }catch(err){
        console.log(err);
    }
})

//login route
router.post('/signin',async (req,res)=>{
    // console.log(req.body);
    // res.json({message:"Signin Successful"}); 
    try{
        let token;
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({error:"Please fill all the fields"});
        }
        const userLogin = await User.findOne({email:email});
        // console.log(userLogin); 
        if(userLogin){
            const isMatch =await bcrypt.compare(password,userLogin.password);
            token = await userLogin.generateAuthToken();
            console.log(token);
            res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+25892000000),
                httpOnly:true
            });


            if(isMatch){
                // res.send("Login Successful");
                res.json({message:"Login Successful"});
            }
            else{
                res.status(400).json({error:"email not matched"});
            }
        }
        else{
            res.status(400).json({error:"Invalid Credentials"});
        }
        
    }catch(err){
        console.log(err);
    }
})


// about us page

router.get('/try',(req,res)=>{
    console.log("Hello my try");
    res.send("Hello from the server try");
})

router.get('/about',authenticate,(req,res)=>{
    console.log("Hello my about");
    res.send(req.rootUser);
})

//get user data for contact and home page
router.get('/getdata',authenticate,(req,res)=>{
    console.log("Hello my getdata");
    res.send(req.rootUser);
})


// contact us page

router.post('/contact',authenticate,async(req,res)=>{
    try{
        const {name,email,phone,message}=req.body;
        if(!name || !email || !phone || !message){
            console.log("Error in contact form");
            return res.json({error:"Please fill the contact form"});
        }

        const userContact = await User.findOne({_id:req.userID});
        if(userContact){
            const userMessage= await userContact.addMessage(name,email,phone,message);
            await userContact.save();
            res.status(201).json({message:"User contact successfully"});
        }
        
    }
    catch(err){
        console.log(err);
    }
})



// logout ka page

router.get('/logout',(req,res)=>{
    console.log('hello my logout page');
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send('User logout');
})

module.exports = router;