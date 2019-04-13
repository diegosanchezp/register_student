'use strict';
//Server
const express = require('express');
const app = express();
//Middlewares
const cors = require('cors');
const fileUpload = require('express-fileupload');
//Enviroment variables
const {env} = require("./utilities");
const env_var = env.read();

app.use(cors());
app.use(express.json());
app.use(fileUpload({
    limits: {fileSize: 1024*1024 * 3}, //MAX_FILE_SIZE = 3MB RES=1024 or 1k
    abortOnLimit: true,
    safeFileNames: true,
    preserveExtension: 4 
}));

app.get('/', (req, res) => {
    res.status(200).json({
        massage: "Hello from server"
    });
});

const studentRoute = require("./routes/students");
const updateRoute = require("./routes/update");
const searchRoute = require("./routes/search");
const adminRoute = require("./routes/admin");
//Endpoints
app.use("/students", studentRoute);
app.use("/update", updateRoute);
app.use("/search", searchRoute);
app.use("/admin", adminRoute);

const port = env_var.API_PORT || 5000;
app.listen(port, env_var.LOCAL_IP, () => console.log(`Listening on ${env_var.LOCAL_IP}:${port}`)).on('error', (error) => {
    if (error.code === 'EADDRNOTAVAIL' || error.code === 'ENOTFOUND') {
        app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));
    }
});
