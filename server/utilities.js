// JavaScript functions that are used in other .js files
// Async functions will return promise :)
// "sql" and "env" serve as namespaces

'use strict';

const fs = require("fs");

const env = {
    read(){
        // Read json file that contains the enviroment files
        const rawdata = fs.readFileSync("config.json", {
            encoding: "utf-8"
        });
        return JSON.parse(rawdata);
    },
    write(varObj){
        // Write a variable to json env file
        const rawdata = fs.readFileSync("config.json", {
            encoding: "utf-8"
        });

        let dataObj = JSON.parse(rawdata);

        for(let key in varObj){
            dataObj[key] = varObj[key];
        }

        fs.writeFileSync("config.json", JSON.stringify(dataObj));
    },
    delete(variable){
        const rawdata = fs.readFileSync("config.json", {
            encoding: "utf-8"
        });
        let dataObj = JSON.parse(rawdata);
        delete dataObj[variable];
        fs.writeFileSync("config.json", JSON.stringify(dataObj));
    }
};

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.cached.Database("./" + env.read().DB_NAME);

const sql = {
    run(query, ...values){
        // Run a query
        return new Promise(function (resolve, reject){
            db.run(query, values, (err) => {
                if(err){
                    reject(err)
                }else{
                    resolve(this);
                }
            });
        }); 
    },
    get(query, ...values){
        // Get one row of data from a table
        return new Promise((resolve, reject) => {
            db.get(query, values, (err, row) => {
                if(err){
                    reject(err);
                }else{
                    resolve(row);
                }
            });
        });
    },
    all(query, ...values){
        // Get an array of rows from a table
        return new Promise((resolve, reject) =>{
            db.all(query, values, (err, rows) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows);
                }
            });
        });
    },
    exists(query, ...values){
        // Check if something is in a table
        return new Promise(async (resolve, reject)=>{
            db.get(query, values, (err, row) => {
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
            });
        });
    },
};

/*sql.all("SELECT * FROM students WHERE last_name = ?", "Sánchez")
.then(row => console.log(row))
.catch(error => console.error(error));*/

/*sql.exists("SELECT user, email FROM admins WHERE email = ?;", "diegosandmg@gmail.com")
.then(bool => console.log(bool))
.catch(error => console.error(error));*/

/*sql.run("INSERT INTO admins (user, email, password) VALUES (?,?,?);", 
    "admin3", "admin3@mail.com", "dloaldwoa"
)
.catch(error => console.error(error));*/

module.exports = {
    env: env,
    sql: sql
};