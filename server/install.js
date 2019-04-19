// This script will walk you through to some basic setup that the 
// web application needs to work 

'use strict';
// Nodejs utilities
const { promisify } = require("util");
// Database
const sqlite3 = require("sqlite3").verbose();
// File I/O
const fs = require("fs").promises;
// Password encryption
const bcrypt = require("bcrypt");
// Work with directories
const path = require("path");

const FILE_NAME = path.resolve(__dirname, ".env");

const studentSchema =
  ` CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    name TEXT  NOT NULL,
    last_name TEXT  NOT NULL,
    e_mail TEXT  NOT NULL UNIQUE,
    age INTEGER NOT NULL,
    gender TEXT  NOT NULL,
    school TEXT,
    uni TEXT NOT NULL,
    prf_pic TEXT NOT NULL
    )`;
const adminSchema =
  ` CREATE TABLE admins (
    user TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL UNIQUE
  )`;

// Terminal I/O 
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// ------Setup walkthrough------
const MESSAGES = [
  "Welcome to the system student developer setup!\
  this will walk you through the enviroment variable\
  \nand database initialization\nWould you like to continue (y/n)\n",
  "\n1) Enviroment variable setup, enter the following values",
  ["API_PORT: ", "STATIC_SERVER_PORT: ", "SERVER_IP: ", "SECRET_KEY: ",
    "DB_URL: "],
  "\n2) Database setup, this is how the tables will look",
  "TABLE \"students\" created", "TABLE \"admins\" created",
  "\n3) Create root_admin", ["Email: ", "Password: "],
  "root_admin created", "Setup completed"
];

// Make readline.question return a promise
rl.question[promisify.custom] = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

(async () => {
  try {
    const ask = promisify(rl.question);
    // const answer = await promisify(rl.question)('What is your name? ');
    let ans = await ask(MESSAGES[0]);
    if (ans == 'y' || ans == 'Y') {
      // Env var setup
      console.log(MESSAGES[1]);
      let fd = await fs.open(FILE_NAME, "w");
      for (let i = 0; i < MESSAGES[2].length - 1; i++) {
        ans = await ask(MESSAGES[2][i]);
        let _var = MESSAGES[2][i].substr(0, MESSAGES[2][i].length - 2);
        let data = `${_var}=${ans}\n`;
        await fd.writeFile(data, { encoding: "utf-8" });
      }
      await fd.close();
      // DB setup
      console.log(MESSAGES[3]);
      console.log(studentSchema);
      console.log(adminSchema);

      ans = await ask("Enter database name: ");
      fd = await fs.open(FILE_NAME, "a");
      let _var = MESSAGES[2][4].substr(0, MESSAGES[2][4].length - 2);
      let data = `${_var}="${__dirname}/${ans}.db"\n`;
      await fd.writeFile(data, { encoding: "utf-8" });
      await fd.close();
      const db = new sqlite3.cached.Database(path.resolve(__dirname, `${ans}.db`));
      db.run = promisify(db.run);
      db.get = promisify(db.get);
      db.all = promisify(db.all);

      await db.run(studentSchema);
      console.log(MESSAGES[4]);
      await db.run(adminSchema);
      console.log(MESSAGES[5]);
      console.log(MESSAGES[6]);
      const queryVals = [];
      for (let i = 0; i < MESSAGES[7].length; i++) {
        ans = await ask(MESSAGES[7][i]);
        queryVals.push(ans);
      }
      //Encript password
      const hash = await bcrypt.hash(queryVals[1], 10);
      await db.run("INSERT INTO admins (user,email,password) VALUES (?,?,?)",
        "root_admin", queryVals[0], hash
      );
      console.log(MESSAGES[8]);
      console.log(MESSAGES[9]);
    }
    rl.close();
  } catch (err) {
    console.error(err);
    rl.close();
  }
})();