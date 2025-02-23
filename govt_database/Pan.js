const mongoose = require('mongoose');
const panSchema = new mongoose.Schema({
    panId:{type:String,unique:true,required:true},
    name:{type:String,required:true},
    mobile:{type:Number,unique:true,required:true},
    state:{type:String,required:true},
    city:{type:String,required:true},
    address:{type:String,required:true},
    dob:{type:String,required:true},
    email:{type:String,unique:true,required:true},
    otp: { type: String },
    otpExpires: { type: Date }
})

module.exports = mongoose.model('Pan ', panSchema);