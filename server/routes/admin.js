// This is the route where the admin access the system
const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.cached.Database("./students.db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// TODO: CRAFT promise function that check if user exist 
// in database and use it with async/await
function userExists(body){
    return new Promise(async (resolve, reject)=>{
        const query = "SELECT user, email FROM admins WHERE email = ?;";
        db.get(query, body.e_mail,
            (err, row) => {
                if(err){
                    console.log(err);
                    reject(error);
                }else{
                    if(row){
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                }
            }
        );
    });
}
router.post("/signup", async (req, res) =>{
    //Register and admin into database
    //This route works fine, it can be used only by the root admin which is the developer
    try{
        // TODO: check if user password === password2
        // Check that the user doesn't exists
        if(await userExists(req.body) === false){
                const hash = await bcrypt.hash(req.body.password, 10);
                const query = "INSERT INTO admins (user, email, password) VALUES (?,?,?);";
                db.run(query, req.body.user, req.body.e_mail, hash,
                    err => {
                        if(err){
                            console.error(err) 
                        }else{
                            res.status(200).send("Admin Registered");
                        }
                    }
                ); 
        }else{
            console.log("Here");
            res.status(400).send(`Admin ${req.body.user} already exists`); 
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.post("/login", (req, res)=>{
    //See if user exists
    const query = "SELECT * FROM admins WHERE user = ? AND email = ?;";
    db.get(query, req.body.user, req.body.e_mail, 
        async (err, row) => {
            if(err){
                console.log(err);
                res.status(500).send("Server Error");
            }else{
                if(row){
                    // Compare admin password
                    try{
                        const match = await bcrypt.compare(req.body.password, row.password)
                        if(match){
                            //Succesfull login - Create token
                            const token = jwt.sign(
                                {user: row.user, e_mail: row.email, admin: true},
                                process.env.SECRET_KEY,
                                {expiresIn: "1h"}
                            );
                            res.status(200).json(
                                {
                                    message:"SUCCESSFULL_LOGIN",
                                    token: token
                                }
                            );
                        }
                    }
                    catch(error){
                        console.log(error);
                        res.status(500).send("Server Error");
                        db.close();
                    }
                }else{  
                    res.status(400).send("Admin not found");
                    db.close();
                }
            }
        }
    );
});
module.exports = router;
