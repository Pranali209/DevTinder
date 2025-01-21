
const jwt = require('jsonwebtoken')
const User = require('../Models/user')


const UserAuth = async(req, res, next) => {
    try {
        const  {token}  = req.cookies;
        if (token) {
            const decodedtxt = await jwt.verify(token , "DevTender@03") 
            if(decodedtxt){
                const user = await User.findOne({ _id: decodedtxt.userid })
                if(user){
                    req.user = user
                }
                else{
                    res.send("User not found")
                }
            }

        }
       

        else {
            throw new Error("you are Unauthorized login first" );
            
        }
        next()

    } catch (error) {
        res.status(400).send("Error "+ error.message);

    }
}

module.exports =
 UserAuth