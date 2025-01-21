const mongoose = require('mongoose');
const {  DB_NAME } = require('../Constant.js')
const Connectdb = async()=>{
   await mongoose.connect(`mongodb+srv://pmodgekar99:Pranali123@cluster0.unzsh.mongodb.net/${DB_NAME}` );
    
}

module.exports = Connectdb;