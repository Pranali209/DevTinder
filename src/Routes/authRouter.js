const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../Models/user')
const router = express.Router();



const {validatesignUp} = require('../Utils/Validatesignup')

router.post('/signup', async (req, res) => {
    try {
         // validate the req.body
        validatesignUp(req)

        const { firstName, lastName, email, password, gender, age, phone } = req.body

        // craete  hash the password
        const HashPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName, lastName, email, password:HashPassword, gender, age, phone
        });

        if (user) {
            await user.save();
            res.send("user created successfully")
        }
        

    } catch (error) {
       res.status(400).send("Error" + error.message)
      
    }

})

router.post('/login' , async(req,res)=>{
    try {
        const{ email ,password} = req.body
        const  user = await User.findOne({email})
        if(user){
             
             
             const IsMatch = await user.validatePassword(password)
            
             
             if(IsMatch){
               const token = await user.getJwtToken()
               res.cookie("token" , token)
               res.send("login successfull")
             }
             else{
                res.status(400).send("Invalid password")
             }
        }
        else{
            res.status(400).send("Invalid credentials please  try again")
        }
        
    } catch (error) {
        res.status(400).send('error' + error.message)
    }
})

router.post('/logout', (req,res)=>{
    res.clearCookie("token" )
    res.send("user logged out successfully")
})


module.exports = router;