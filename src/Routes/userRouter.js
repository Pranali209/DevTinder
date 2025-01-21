const express = require('express')
const ConnectionRequest = require('../Models/connectionrequest.js')
const router = express.Router()
const UserAuth = require('../middleware/UserAuth')
const User = require('../Models/user.js')
const UserSafeData =  ["firstName", "lastName", "photourl", "age", "gender", "about", "skills"]
router.get('/requests/recevied', UserAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const allRequest = await ConnectionRequest.find({

            toUserId: loggedInUser._id,
            status: "interested"

        }).populate("fromUserId", ["firstName", "lastName"])

        if (!allRequest) {
            return res.status(404).json({ message: "No requests found" })
        }
        res.status(200).json({
            message: ` All the received Request`,
            data: allRequest
        })
    } catch (error) {
        res.status(400).json({
            message: "Error Occured",
            error: error.message
        })
    }
})


router.get('/requests/matches', UserAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const Matches = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate('fromUserId', UserSafeData
        ).populate('toUserId',UserSafeData)


        if (!Matches) {
            throw new Error("No matches Found")
        }
        const data = Matches.map(feild => {
            if (feild.fromUserId._id.equals(loggedInUser._id)) {
                return feild.toUserId
            }
            else {
                return feild.fromUserId
            }
        }

        )
        res.json({
            message: ` All the matches`,
            data: data
        })

    } catch (error) {
        res.status(400).json({
            message: "Error Occured",
            error: error.message
        })
    }
})


// 1. he should not see his own profile (done)
// 2. he should not see the profile to whom he has sent the request
// 3. he should not see the profile who have sent the request to him 
router.get('/feed', UserAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10;
        

        const skip = ( page - 1) *limit
        const loggedInUser = req.user;
        

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId  toUserId")


        const HideUsers = new Set();
         connectionRequests.forEach((req)=>{
            
            HideUsers.add(req.fromUserId.toString());
            HideUsers.add(req.toUserId.toString());

         })
         const hideUsersArray = await User.find({
            $and:[
               {
                 _id : { $nin : Array.from(HideUsers)}
               },
               {
                  _id : {
                    $ne : loggedInUser._id
                  }
               }
            ]
         }).select(UserSafeData).skip(skip).limit(limit)

        res.json({
            message: "All the users",
            data: hideUsersArray
        })
        console.log( hideUsersArray);
        



      







    } catch (error) {
        res.status(400).json({
            message: "Error Occured",
        })
    }
})


module.exports = router