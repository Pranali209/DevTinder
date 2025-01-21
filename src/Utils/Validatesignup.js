const validator = require('validator');

const validatesignUp = (req)=>{
    const {firstName, lastName,  email, password ,age} = req.body;
    if(!firstName || !lastName)
    {
       throw new Error("Please enter the Name");
      
    }
    else if(!validator.isEmail(email))
    {
        throw new Error('Please enter the valid email')
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error('Please enter the strong password')
    }
    else if(!(age >18)){
        throw new Error('You are not eligible !!!!')

    }


}

const validateEditdata = (req)=>{
    const allowedUpdateFeild = [ "gender" , "age", "skills" , "firstName" , "lastName" ,"phone","photoUrl"];

    const IsValid = Object.keys(req.body).every((feild)=> allowedUpdateFeild.includes(feild))
    console.log(IsValid)

    return IsValid

}



module.exports = {
    validatesignUp,
    validateEditdata
}