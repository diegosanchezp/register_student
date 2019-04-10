//This middleware function checks if the admin is logged in
const jwt = require("jsonwebtoken");
module.exports = (req,res,next) =>{
    try{
        //GET token from http header
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(
            token, process.env.SECRET_KEY
        ); // Decoded data from json web token
        req.adminData = decoded;
        next();
    }   
    catch(error){
        // Error is thrown by jwt.verify method
        res.status(401).send("AUTH_FAILED")
    }
};