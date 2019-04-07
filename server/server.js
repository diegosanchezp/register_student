'use strict';
//Server
const express = require('express');
const app = express();
//Database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('students.db');
//Middlewares
const cors = require('cors');
const fileUpload = require('express-fileupload');

app.use(cors());
app.use(express.json());
app.use(fileUpload({
    limits: {fileSize: 3145728}, //MAX_FILE_SIZE = 3MB
    abortOnLimit: true
}));

/*Function definitions*/
function equalStudent(a, b) {
    //Verify if two students are equal
    if (a.name == b.name && a.l_name == b.last_name
        && a.age == b.age && a.gender == b.gender
        && a.school == b.school && a.uni == b.uni) {
        return true;
    } else {
        return false;
    }
}
function search(search_key, st_key) {
    //Search a student in the database and return the data associated with it 
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM students WHERE ${search_key} = ?`;
        db.all(query, st_key, (err, row) => {
            if (err) {
                reject(err);
            } else if (row.length == 0) {
                reject(new Error("Student not found"));
            } else {
                resolve(row);
            }
        });
    });
}
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

app.get('/', (req, res) => {
    res.json({
        massage: "Hello from server"
    });
});

//Register route
/*app.post('/register', (req, res) => {
    //If there is an image
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
});*/

//Get all students route 
/*app.get('/students', (req, res) => {
    db.all('SELECT * FROM students', (err, row) => {
        if (err) {
            console.error(err);
        } else {
            res.json(row);
        }
    });
});*/
const studentRoute = require("./routes/students");
const updateRoute = require("./routes/update");
const searchRoute = require("./routes/search");
app.use("/students", studentRoute);
app.use("/update", updateRoute);
app.use("/search", searchRoute);

//Search Route
/*app.get('/students/:key', (req, res) => {
    let email_reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let split = req.params.key.split(' ');
    console.log(split);
    if (email_reg.test(req.params.key)) {
        db.get('SELECT * FROM students WHERE e_mail = ?', req.params.key,
            (err, row) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(row);
                }
            }
        );
    } else if (split.length == 2) {
        let query = 'SELECT * FROM students WHERE name = ? AND last_name = ?';
        db.all(query, split[0], split[1],
            (err, row) => {
                if (err) {
                    console.error(err);
                } else {
                    if (row.length > 0) {
                        res.send(row);
                    } else {
                        db.all(query, split[1], split[0], (err, row) => {
                            if (err) {
                                console.error(err);
                            } else {
                                res.send(row);
                            }
                        });
                    }

                }
            }
        );
    // Warning callback hell
    } else if (split.length == 1) {
        // Search a student by its name
        search("name", split[0]).then(row => res.send(row))
        .catch(error => {
            // Search a student by its last_name
            if (error.message == "Student not found") {
                search("last_name", split[0]).then(row => res.send(row))
                .catch(error => {
                    if (error.message == "Student not found") {
                       // Search a student by its school 
                       search("school", split[0]).then(row => res.send(row))
                       .catch(error => {
                            if (error.message == "Student not found"){
                                // Search a student by its university
                                search("uni", split[0]).then(row => res.send(row))
                                .catch(error =>{
                                    if (error.message == "Student not found"){
                                        // Search a student by its gender
                                        search("gender", split[0]).then(row => res.send(row))
                                        .catch(error =>{
                                            if (error.message == "Student not found") {
                                                // Search student by it's age
                                                search("age", split[0]).then(row => res.send(row))
                                                .catch(error => res.status(400).send("Bad request"));
                                            }
                                        });
                                    }
                                });
                            }
                       });
                    }
                });
            }
        });
    } else {
        res.status(400).send('Bad Request');
    }
});*/

//Delete a student route
/*app.delete('/students/delete/:ID', (req, res) => {
    let query = 'DELETE FROM students WHERE id = ?';
    db.run(query, req.params.ID, (error) => {
        if (error) {
            res.status(500).send('Server Error');
        } else {
            console.log(`Student ${req.params.ID} deleted`);
            res.send(`Student deleted`);
        }
    });
});*/

/*app.post('/modify/:ID', (req, res)=>{
    
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
    req.body.uni, req.body.prf_pic, req.params.ID,
        error => {
            if(error){
                console.error(error);
                res.status(500).send("Internal Server Error")
            }else{
                res.send("Data modified");
            }
        }
    );
});*/
const port = process.env.PORT || 5000;
app.listen(port, '192.168.2.2', () => console.log(`Listening on 192.168.2.2:${port}`)).on('error', (error) => {
    if (error.code === 'EADDRNOTAVAIL' || error.code === 'ENOTFOUND') {
        app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));
    }
});
