// This is the /update route
const express = require("express");
const router = express.Router();
const {sql} = require("../utilities");
const {validImage} = require("../utilities");
router.post("/:id", async (req, res) =>{
    try{
        // If image validate image
        if (Object.keys(req.files).length != 0) {
            if (validImage(req.files.prfPic.name)) {
                req.body['prf_pic'] = req.files.prfPic.name;
                //Save profile picture to image folder
                const prfPic = req.files.prfPic;
                const imgUrl = '../client/img/prf_pics' + '/' + req.body['prf_pic'];
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
        await sql.run("UPDATE students SET name = ?, last_name = ?, e_mail = ?, \
        age =?, gender = ?, school = ?, uni = ?, prf_pic = ? WHERE id = ?",
        req.body.name, req.body.l_name, req.body.e_mail,
        req.body.age, req.body.gender, req.body.school, 
        req.body.uni, req.body.prf_pic, req.params.id);

        res.status(200).send("Data modified");
    }catch(err){
        console.error(err); 
        res.status(500).send("Server Error");
    }
});

module.exports = router;