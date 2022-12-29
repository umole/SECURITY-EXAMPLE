const fs = require('fs')
const path = require('path');
const http = require('http');
const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(helmet());

function checkLoggedIn(req, res, next) {
    const isLoggedin = true; //TODO
    if (!isLoggedin) {
        res.status(401).json({
            error: "You must log in"
        });
    } 
    next();
}

app.get('/auth/google/', (req, res) => {});

app.get('/auth/google/callback', (req, res) => {});

app.get('/auth/logout', (req, res) => {});

app.get('/secret', checkLoggedIn, (req, res) => {
    res.send('Your secret code is 22');
});

//set up a route to listen to the request 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '.', 'public', 'index.html'));
});

const PORT = 3000;
http.createServer({
    key: '',
    cert: '',
}).listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});