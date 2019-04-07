// This is the /update route
const express = require("express");
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.cached.Database('./students.db');

router.post("/:id", (req, res) =>{
    let query = "UPDATE students SET name = ?, last_name = ?, e_mail = ?, \
    age =?, gender = ?, school = ?, uni = ?, prf_pic = ? WHERE id = ?";

    // If image validate image
    if (Object.keys(req.files).length != 0) {
        if (validImage(req.files.prfPic.name)) {
            req.body['prf_pic'] = req.files.prfPic.name;
            //Save profile picture to image folder
            let prfPic = req.files.prfPic;
            let imgUrl = '../client/img/prf_pics' + '/' + req.body['prf_pic'];
            if (prfPic) {
                prfPic.mv(imgUrl);
            }else{
                return res.status(400).send('No valid image');
            }
        } else {
            return res.status(400).send('No valid image');
        }
    }
    // If no image leave default image
    db.run(query, req.body.name, req.body.l_name, req.body.e_mail, 
    req.body.age, req.body.gender, req.body.school, 
    req.body.uni, req.body.prf_pic, req.params.id,
        error => {
            if(error){
                console.error(error);
                res.status(500).send("Internal Server Error")
            }else{
                res.send("Data modified");
            }
        }
    );
});

module.exports = router;