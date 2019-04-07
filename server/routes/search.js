// This is the /search/:key route
const express = require("express");
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.cached.Database('./students.db');

/* Function definitions */

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

router.get("/:key", (req, res) =>{
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
});

module.exports = router;