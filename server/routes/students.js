// This is the /students route
const express = require("express");
const router = express.Router();
const {db, validImage, exists} = require("../utilities");
/* GET all the database students */
router.get("/", async (req, res) => {
    try{
        const row = await db.all("SELECT * FROM students");
        if(row.length > 0){
            res.status(200).json(row);
        }else{
            res.status(204).send("No students")
        }
    }catch(err){
        console.error(err);
        res.status(500).send("Server Error");
    }
});
/* Create or register a student into the database */
router.post("/", async (req, res) =>{
    try{
        if(req.files){
            if (Object.keys(req.files).length != 0) {
                if (validImage(req.files.prfPic.name)) {
                    req.body['prf_pic'] = req.files.prfPic.name;
                } else {
                    return res.status(400).send('No valid image');
                }
            }
        }else{
            //If No image then set a default pic
            if (req.body.gender == 'M') {
                if (req.body.age < 30) {
                    req.body['prf_pic'] = 'avatar2.png';
                } else {
                    req.body['prf_pic'] = 'avatar3.png';
                }
            } else {
                if (req.body.gender == 'F') {
                    req.body['prf_pic'] = 'avatar6.png';
                } else {
                    req.body['prf_pic'] = 'avatar2.png';
                }
            }

        }
        
        await db.run("INSERT INTO students \
        (name, last_name,e_mail,age,gender,school,uni, prf_pic) \
        VALUES (?,?,?,?,?,?,?,?)", 
        req.body.name, req.body.l_name, req.body.e_mail, req.body.age,
        req.body.gender, req.body.school, req.body.uni,
        req.body.prf_pic);

        // Save profile pic to folder
        if(req.files){
            if(Object.keys(req.files).length != 0){
                let prfPic = req.files.prfPic;
                let imgUrl = '../client/img/prf_pics' + '/' + req.body['prf_pic'];
                if (prfPic && validImage(req.body['prf_pic'])) {
                    prfPic.mv(imgUrl);
                }
            }
        }
        res.status(200).send(`Student ${req.body.name} registered`);
    }catch(err){
        if(err.code === "SQLITE_CONSTRAINT"){
            console.log(err);
           res.status(400).send(`Student ${req.body.name} already registered`);  
        }else{
            console.error(err); 
            res.status(500).send("Server Error");
        }
    }
});

/* Delete a student from database */
router.delete("/:id", async (req, res) => {
    try{
        if(exists("SELECT * from students WHERE id = ?", req.params.id)){
            await db.run("DELETE FROM students WHERE id = ?", req.params.id);
            res.send(`Student deleted`);
        }else{
            res.status(404).send("Student doesn't exists");
        }
    }catch(err){
        console.error(err); 
        res.status(500).send("Server Error");
    }
});
module.exports = router;    