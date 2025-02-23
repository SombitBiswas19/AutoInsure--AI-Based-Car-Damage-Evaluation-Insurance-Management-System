const mongoose = require('mongoose');
const licenseSchema = new mongoose.Schema({
    license:{type:String,required:true},
    name:{type:String,required:true},
    state:{type:String,required:true},
    city:{type:String,required:true},
    address:{type:String,required:true},
    dob:{type:String,required:true},
    issued:{type:String,required:true},
    validTill:{type:String,required:true},
})

module.exports = mongoose.model('License ', licenseSchema);