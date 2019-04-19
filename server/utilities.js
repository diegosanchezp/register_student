// JavaScript functions that are used in other .js files
// Async functions will return promise :)
// "sql" and "env" serve as namespaces

'use strict';

const fs = require("fs");
const FILE_NAME = "sysconfig.json";
const util = require("util");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.cached.Database(process.env.DB_URL);
db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);

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
/**
 * // Check if something is in a table
 * @param {string} query 
 * @param  {...any} values 
 */
function exists(query, ...values) {
    return new Promise(async (resolve, reject) => {
        try {
            if (await db.get(query, values)) {
                resolve(true)
            } else {
                resolve(false);
            }
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    db: db,
    validImage: validImage,
    exists: exists
};