// This is the /students route
const express = require("express");
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.cached.Database('./students.db');

/* Function definitions */
function validImage(filename) {
    //Verify that file extension is JPG, JPEG, or PNG
    let ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg'];
    for (let ext of ALLOWED_EXTENSIONS) {
        if (filename.includes(ext)) { return true; }
    }
    return false;
}

function registerStudent(req) {
    //Register a student s into the database students.db
    db.run(`INSERT INTO students 
        (name, last_name,e_mail,age,gender,school,uni, prf_pic) 
        VALUES (?,?,?,?,?,?,?,?)`,
        req.body.name, req.body.l_name, req.body.e_mail, req.body.age,
        req.body.gender, req.body.school, req.body.uni,
        req.body.prf_pic,
        (error) => {
            if (error) {
                console.error(error);
            } else {
                //Save profile picture to image folder

                let prfPic = req.files.prfPic;

                let imgUrl = '../client/img/prf_pics' + '/' + req.body['prf_pic'];
                if (prfPic && validImage(req.body['prf_pic'])) {
                    prfPic.mv(imgUrl);
                }
            }
        }
    );
}

/* GET all the database students */
router.get("/", (req, res) => {
    db.all('SELECT * FROM students', (err, row) => {
        if (err) {
            console.error(err);
        } else {
            res.json(row);
        }
    });
});
/* Create or register a student into the database */
router.post("/", (req, res) =>{
    if (Object.keys(req.files).length != 0) {
        if (validImage(req.files.prfPic.name)) {
            req.body['prf_pic'] = req.files.prfPic.name;
        } else {
            return res.status(400).send('No valid image');
        }
    } else {
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

    db.get(
        'SELECT * FROM students WHERE e_mail = ?',
        req.body.e_mail,
        (err, row) => {
            //Verify that the student doesnt exist in database
            if (!row) { //row undefined
                registerStudent(req);
                res.send('Student registered');
            } else {
                if (req.body.e_mail != row.e_mail) {
                    //Save req.body to database
                    registerStudent(req);
                    console.log(`Student ${req.body.name} registered`);
                    res.send(`Student ${req.body.name} registered`);
                } else {
                    console.log('Student Already registered');
                    res.send('Already registered');
                }
            }
        }
    );
});

/* Delete a student from database */
router.delete("/:id", (req, res) =>{
    let query = 'DELETE FROM students WHERE id = ?';
    db.run(query, req.params.id, (error) => {
        if (error) {
            res.status(500).send('Server Error');
        } else {
            console.log(`Student ${req.params.id} deleted`);
            res.send(`Student deleted`);
        }
    });
});
module.exports = router;    