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

app.get('/', (req, res) => {
    res.status(200).json({
        massage: "Hello from server"
    });
});

const studentRoute = require("./routes/students");
const updateRoute = require("./routes/update");
const searchRoute = require("./routes/search");

app.use("/students", studentRoute);
app.use("/update", updateRoute);
app.use("/search", searchRoute);

const port = process.env.PORT || 5000;
app.listen(port, '192.168.2.2', () => console.log(`Listening on 192.168.2.2:${port}`)).on('error', (error) => {
    if (error.code === 'EADDRNOTAVAIL' || error.code === 'ENOTFOUND') {
        app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));
    }
});
