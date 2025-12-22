const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

//we dont have to define the username and pasword in the schema as it is already defined by the passsword-local-mongoose
const userSchema = new Schema({
    email:{
        type: String,
        required: true
    }
})

userSchema.plugin(passportLocalMongoose); //it is used for using the predefined usename and password

module.exports = mongoose.model('User', userSchema);