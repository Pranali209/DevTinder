const express = require("express")
const UserAuth = require('../middleware/UserAuth')
const router = express.Router()

const ConnectionRequest = require('../Models/connectionrequest')
const User = require("../Models/user")

router.post('/request/:status/:userId', UserAuth, async (req, res) => {

    try {


        const status = req.params.status;
        const fromuserid = req.user._id;
        const touserid = req.params.userId;
        if (!(status === "interested" || status === "ignored")) {
            throw new Error("Invalid status value ")
        }

        if (fromuserid.equals(touserid)) {


            throw new Error("You can't send request to yourself")

        }


        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromuserid, touserid },
                { fromUserId: touserid, toUserId: fromuserid }

            ]
        })

        if (existingRequest) {
            throw new Error("You have already sent a request to this user")
        }






        const toId = await User.findById(touserid)
        if (toId) {
            const request = new ConnectionRequest({
                fromUserId: fromuserid,
                toUserId: toId,
                status: status
            })
            if (request) {
                await request.save()
                res.json({
                    message: "Connection Request Sent Successfully",
                    data: request
                })
            }
            else {
                throw new Error(" Connection Request failed  ");

            }

        }
        else {
            throw new Error("User not found")
        }


    } catch (error) {
        res.status(400).send("Error sending the request" + error.message)
    }
})

router.post('/request/review/:status/:requestId', UserAuth, async (req, res) => {

    //validate status to be either accepted or rejected
    try {
        const { status, requestId } = req.params;
        const loggedInuser = req.user
   
        
        const allowedStatus = ["accepted", "rejected"]
        if (!(allowedStatus.includes(status))) {
            throw new Error("Invalid status");

        }

        const requestedUser =  await ConnectionRequest.findOne({
            toUserId:loggedInuser._id,
            status:"interested",
            _id:requestId

        })

        if(! requestedUser){
            throw new Error("Request not found")
        }

        requestedUser.status = status
       await requestedUser.save()
   
        
        res.status(200).send(`Request ${status} successfully`);





    } catch (error) {
        res.status(400).send("Error " + error.message)
    }

})

module.exports = router