const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true,
        minlength:3,
        maxlength:15
        

    },
    lastName : {
        type : String,
        trim : true,
        required : true,
        minlength:3,
        maxlength:15
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        validate(value){

            if(!(validator.isEmail(value)))
            {
                throw new Error("Email is not valid");
            }
           
    }
  
    
    },
    password : {
        type : String,
        required : true,
        minlength:8,
     
       validate(value){
            if(!(validator.isStrongPassword(value)))
            {
                throw new Error("Password is not strong");
        }
    }

    },
    gender : {
        type : String,
        required : true,
       enum : ['male' ,'female' ,'other']

    },
    age:{
        type : Number,
        required : true,
        min:18
    },
    phone : {
        type : Number,
        required : true,
      
    },
    skills:{
        type:Array,
        required:true,
        validate(value){
            if(value.length > 10)
            {
                throw new Error("skills should be less than 10");
            }

        
    },
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value))
            {
                throw new Error("Invalid URL");
            }
        }
    },
    about : {
        type : String,
        
    }
},
} , {timestamps : true});




userSchema.methods.getJwtToken = async function (params) {
    const user = this;
    const token =  await jwt.sign({userid : user._id},'DevTender@03' , {
                        expiresIn : '1d'
                    } );
               
                
                    return token;
}

userSchema.methods.validatePassword = async function (userEnterPassword) {
    const user = this;
    const HashPassword = user.password

    const isPasswordValid  = await bcrypt.compare( userEnterPassword , HashPassword);

    return isPasswordValid
    
}



// userSchema.methods.createHashPassword =  async function (userEnterPassword) {
  
//     const HashPassword = await bcrypt.hash(userEnterPassword,10)
//     return HashPassword
    
// }



const User =  mongoose.model('User',userSchema);

module.exports = User;

