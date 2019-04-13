// JavaScript functions that are used in other .js files
// Async functions will return promise :)
// "sql" and "env" serve as namespaces

'use strict';

const fs = require("fs");
const FILE_NAME = "sysconfig.json";

const env = {
    /**
     * Read a json file that contains the enviroment files
     */
    read(){
    const rawdata = fs.readFileSync(FILE_NAME, {
            encoding: "utf-8"
        });
        return JSON.parse(rawdata);
    },
    /**
     * Write a variable to json env file
     * @param {Object} varObj 
     */
    write(varObj){
    const rawdata = fs.readFileSync(FILE_NAME, {
            encoding: "utf-8"
        });

        let dataObj = JSON.parse(rawdata);

        for(let key in varObj){
            dataObj[key] = varObj[key];
        }

        fs.writeFileSync(FILE_NAME, JSON.stringify(dataObj));
    },
    /**
     * Delete a variable from config.json file
     * @param {string} variable 
     */
    delete(variable){
        const rawdata = fs.readFileSync(FILE_NAME, {
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
    /**
     * Runs the SQL query with the specified parameters and 
     * calls the callback afterwards. It does not retrieve any result data.
     * @param {string} query - The SQL query to run.
     * @param  {...any} values - When the SQL statement contains placeholders, 
     * you can pass them in here.
     */
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
    /**
     * Runs the SQL query with the specified parameters and calls the 
     * callback with the first result row afterwards
     * @param {string} query - The SQL query to run. 
     * @param  {...any} values - When the SQL statement contains placeholders,  
     * you can pass them in here.   
     */
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
/**
 * //Verify that file extension is JPG, JPEG, or PNG
 * @param {string} filename 
 */
function validImage(filename) {
    //Verify that file extension is JPG, JPEG, or PNG
    const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg'];
    for (let ext of ALLOWED_EXTENSIONS) {
        if (filename.includes(ext)) { return true; }
    }
    return false;
}
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
    sql: sql,
    validImage: validImage
};