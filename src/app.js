const express = require('express');
const app = express();
const bcrypt = require('bcrypt')
const validatesignUp = require('./Utils/Validatesignup')
const Connectdb = require('./Config/database');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const User = require('./Models/user');
const UserAuth = require('./middleware/UserAuth')
const AuthRouter = require('./Routes/authRouter')
const profileRouter = require('./Routes/profileRouter')
const userRouter = require('./Routes/userRouter')
const connectedRouter  = require('./Routes/connectionRouter')

Connectdb().then(()=>{
    console.log("Successfully connected to the database.......");
    app.listen(3000,()=>{
        console.log("Sucessfully listiening on the port 3000.......");
        
    })
}).catch((err)=>{
    console.log("Database connection failed!!",err);
})


app.use(express.json());
app.use(cookieParser());

app.use('/', AuthRouter)
app.use('/' , profileRouter)
app.use('/' , connectedRouter)
app.use('/', userRouter)





    






