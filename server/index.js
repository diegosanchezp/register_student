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
app.use(fileUpload());

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

app.post('/register', (req, res) => {
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
                req.body['prf_pic'] = 'avatar3.png';
            } else {
                req.body['prf_pic'] = 'avatar2.png';
            }
        }
    }
    console.log(req.body);

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
                    res.send('Student registered');
                } else {
                    console.log('Student Already registered');
                    res.send('Already registered');
                }
            }
        }
    );
});

app.get('/students', (req, res) => {
    db.all('SELECT * FROM students', (err, row) => {
        if (err) {
            console.error(err);
        } else {
            res.json(row);
        }
    });
});

app.get('/students/:key', (req, res) => {
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
    } else if (split.length == 1) {
        let query = 'SELECT * FROM students WHERE name = ?';
        db.all(query, split[0],
            (err, row) => {
                if (err) {
                    console.log(err);
                } else {
                    if (row.length > 0) {
                        res.send(row);
                    } else {
                        query = 'SELECT * FROM students WHERE last_name = ?';
                        db.all(query, split[0], (err, row) => {
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
    } else {
        res.status(400).send('Bad Request');
    }
});

app.delete('/students/delete/:email', (req, res) => {
    let query = 'DELETE FROM students WHERE e_mail = ?';
    db.run(query, req.params.email, (error) => {
        if (error) {
            res.students(500).send('Server Error');
        } else {
            console.log(`Student ${req.params.email} deleted`);
            res.send(`Student ${req.params.email} deleted`);
        }
    });
});

const port = process.env.PORT || 5000;
app.listen(port, '192.168.2.4', () => console.log(`Listening on 192.168.2.4:${port}`)).on('error', (error) => {
    if (error.code === 'EADDRNOTAVAIL' || error.code === 'ENOTFOUND') {
        app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));
    }
});