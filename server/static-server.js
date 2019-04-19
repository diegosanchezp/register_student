// Static file server for production
// live-server is used for development
'use strict';

const express = require('express');
const path = require('path');
const swig = require('swig');
const app = express();
const volleyball = require('volleyball');
const checkAuth = require('./middleware/check_auth');
//Enviroment variables
const env = process.env;

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../client/templates'));
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!

// Make the url's serve static files
app.use('/css', express.static(path.join(__dirname, '../client/css')));
app.use('/img', express.static(path.join(__dirname, '../client/img')));
app.use('/fonts', express.static(path.join(__dirname, '../client/fonts')));
app.use('/js', express.static(path.join(__dirname, '../client/js')));

// Log HTTP request with volleyball
app.use(volleyball);

app.get('/', (req, res) => {

    res.render('index',
        {
            'title': 'Register students',
            'styles': ['register.css']
        }
    );
});
// TO-DO: protect this route with jwt
app.get('/students', (req, res) => {
    res.render('students',
        {
            'title': 'Students',
            'styles': ['students.css']
        }
    );
})
app.get('/install', (req, res) =>{
    res.render('install', 
        {
            'title': 'Installation setup',
            'styles': ['materialize.min.css', 'install.css']
        }
    );
});

const port = env.STATIC_SERVER_PORT || 8080;
app.listen(port, env.SERVER_IP, () => console.log(`Listening on ${env.SERVER_IP}:${port}`))
    .on('error', (error) => {
        if (error.code === 'EADDRNOTAVAIL' || error.code === 'ENOTFOUND') {
            app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));
        }
    });