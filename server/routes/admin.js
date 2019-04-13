// This is the route where the admin access the system
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {sql} = require("../utilities");
const {env} = require("../utilities");
const env_var = env.read();

router.post("/signup", async (req, res) =>{
    //Register and admin into database
    //This route works fine, it can be used only by the root admin which is the developer
    try{
        // TODO: check if user password === password2 frontend
        // Check that the user doesn't exists
        const hash = await bcrypt.hash(req.body.password, 10);
        await sql.run("INSERT INTO admins (user,email,password) VALUES (?,?,?)",
            req.body.user, req.body.e_mail, hash
        );
        res.status(200).send("Admin Registered");
    }catch(err){
        console.error(err)
        if(err.code === "SQLITE_CONSTRAINT"){
           res.status(400).send(`Admin ${req.body.user} already exists`);  
        }else{
            console.error(err); 
            res.status(500).send("Server Error");
        }
    }
});

router.post("/login", async (req, res)=>{
    try{
        const row = await sql.get("SELECT * FROM admins WHERE user = ? AND email = ?", 
        req.body.user, req.body.e_mail);
        //See if user exists
        if(row){
            const match = await bcrypt.compare(req.body.password, row.password)
            if(match){
                //Succesfull login - Create token
                const token = jwt.sign(
                    {user: row.user, e_mail: row.email, admin: true},
                    env_var.SECRET_KEY,
                    {expiresIn: "1h"}
                );
                res.status(200).json(
                    {
                        message:"SUCCESSFULL_LOGIN",
                        token: token
                    }
                );
            } 
        }else{
            res.status(400).send("Admin not found");
        }
    }catch(err){
        console.error(err);
        res.status(500).send("Server Error"); 
    }
});
module.exports = router;
