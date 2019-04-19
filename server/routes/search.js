// This is the /search/:key route
const express = require("express");
const router = express.Router();
const {db} = require("../utilities");
/* Function definitions */

router.get("/:key", async (req, res) => {
    let email_reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let split = req.params.key.split(' ');
    console.log(split);
    try{
        if(email_reg.test(req.params.key)) {
            const row = await db.get("SELECT * FROM students WHERE e_mail = ?",
            req.params.key);
            if(row){
                res.status(200).json(row);
            }else{
                res.status(204).send('NOT_FOUND');
            }
        }else if(split.length == 2){
            const query = "SELECT * FROM students WHERE name = ? AND last_name = ?";
            let row_array = await db.all(query,split[0], split[1]);
            if(row_array.length > 0){
               res.status(200).json(row_array); 
            }else{
                // Reverse search last_name AND name
                row_array = await db.all(query, split[1], split[0]);
                if(row_array.length > 0){
                    res.status(200).json(row_array);
                }else{
                    res.status(204).send("NOT_FOUND");
                }
            }
        // Warning callback hell
        } else if (split.length == 1) {
            // Search a student by its name "name", "last_name", "school", "uni", "gender", "age"
            const query = "SELECT * FROM students WHERE name = ? OR last_name = ? OR school = ? \
            OR uni = ? OR gender = ? OR age = ?";
            const row = await db.all(query, split[0], split[0], split[0], split[0], 
            split[0], split[0]);
            if(row.length > 0){
                res.status(200).json(row);
            }else{
                res.status(204).send("NOT_FOUND");  
            }

        } else {
            res.status(400).send('Bad Request');
        }
    }catch(err){
        console.error(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;