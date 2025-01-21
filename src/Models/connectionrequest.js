const mongoose = require('mongoose')


const ConnectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
       
    },
    toUserId :{
        type : mongoose.Schema.Types.ObjectId,
        required:true,
        ref : "User"

    },
    status:{
        type:String,
        enum : {
            values:  ["interested" , "ignored" ,"accepted" , "rejected"],
            message :" {value} not accepted"
        }
       
        
    }
},{timestamps : true})



ConnectionRequestSchema.index({
    fromUserId: 1, toUserId:-1
})



const ConnectionRequest =  mongoose.model("Connectionrequest" , ConnectionRequestSchema);

module.exports =
    ConnectionRequest
