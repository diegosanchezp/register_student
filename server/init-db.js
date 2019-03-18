'use strict';
// Database
let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.chaced.Database('students.db');
// I/O console 
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const message = "\nInit-database creates students.db database \
and a students table, \nif database already exists it resets \
the table\n\
\nWould you like to continue (y/n)\n";

readline.question(message, ans=>{
  if(ans === 'y' || ans ==='Y'){
    db.serialize( () =>{
      db.run('DROP TABLE IF EXISTS students');    

      db.run(`CREATE TABLE students (
        id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
        name TEXT  NOT NULL,
        last_name TEXT  NOT NULL,
        e_mail TEXT  NOT NULL UNIQUE,
        age INTEGER NOT NULL,
        gender TEXT  NOT NULL,
        school TEXT,
        uni TEXT NOT NULL,
        prf_pic TEXT NOT NULL
      )`);

      console.log('Database students.db created');

      db.close();
    });  
  }
  readline.close();
});


