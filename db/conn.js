const mongoose = require('mongoose');

const DB = process.env.DATABASE;

mongoose.set('strictQuery', true);
mongoose.connect(DB,{
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
}).then(()=>{
    console.log("Connected to database");
}).catch((err)=>{console.log(err)})
