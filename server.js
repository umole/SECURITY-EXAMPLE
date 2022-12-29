const fs = require('fs')
const path = require('path');
const http = require('http');
const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(helmet());

//set up a route to listen to the request 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '.', 'public', 'index.html'));
});

app.get('/secret', (req, res) => {
    res.send('Your secret code is 22');
})

const PORT = 3000;
http.createServer({
    key: '',
    cert: '',
}).listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});