const express = require("express");
const UserAuth = require('../middleware/UserAuth');
const { validateEditdata} = require('../Utils/Validatesignup')
const router = express.Router();
const User = require('../Models/user')
const bcrypt = require('bcrypt')

router.get('/profile/view'  ,UserAuth, async(req,res)=>{

    try{
        res.send(req.user)
       
    }catch(err){
        res.status(400).send("Some issue please check" , err.message);
    }
})

router.patch('/profile/edit' , UserAuth , async(req,res)=>{

   try {
      const IsValid  = validateEditdata(req)
    if(IsValid){
        const loggeduser = req.user;
        const updatedUser = await loggeduser.updateOne(req.body)
        console.log(updatedUser);
        
        res.send(" profile updated successfully")
    }
    else{
        throw new Error(" Invalid edit feilds");
        
    }
    
    
   } catch (error) {
      res.status(400).send("Error while editing the profile" + error.message)
   }
})
router.post('/forgotpassword' , UserAuth, async(req,res)=>{
    try {
        const { email , password} = req.body;
      
        const user = req.user

        if(!(email === req.user.email))
        {
           throw new Error(" Email does not match");
           
        }

        if(user){
            const HashPassword = await bcrypt.hash(password,10)
            const  result = await user.updateOne({password:HashPassword})
            const token = res.clearCookie("token")
            res.send("password updated successfully")
            console.log(result);
            
        }
        else{
            res.send(" user not found ")
        }
        
    } catch (error) {
        res.status(400).send(" Try again" + error.message)
    }
})



module.exports = router;
