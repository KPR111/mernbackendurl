const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: Number,
        required: true,
    },
    work:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    cpassword:{
        type: String,   
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    messages:[
        {
            name:{
                type: String,
                required: true
            },
            email:{
                type: String,
                required: true,
                unique: true
            },
            phone:{
                type: Number,
                required: true,
            },
            message:{
                type: String,
                required: true
            }
        }
    ],
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]

})

//this function is called before the data is saved in the database using pre method
userSchema.pre('save',async function(next){//you cannot use the arrow function here because we are using the this keyword

//we are hashing the password
    console.log('its running');
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12);
        this.cpassword = await bcrypt.hash(this.cpassword,12);
    }
    next();
})

//we are generating the token and you can not use the arrow function here because we are using the this keyword
userSchema.methods.generateAuthToken= async function(){
    try{//this._id is the id of the user who is logged in and id is the from database
        let token=jwt.sign({_id:this._id},process.env.SECRET_KEY);//payload,secret key
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(err){
        console.log(err);
    }
}


//storing the message in the database
userSchema.methods.addMessage=async function(name,email,phone,message){
    try{
        this.messages=this.messages.concat({name,email,phone,message});
        await this.save();
        return this.messages;
    }
    catch(err){
        console.log(err);
    }
}


const User= mongoose.model('USER',userSchema);

module.exports = User;
