const express = require('express');
const path = require('path');

const app = express();

//set up a route to listen to the request 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '.', 'public', 'index.html'));
});

app.get('/secret', (req, res) => {
    res.send('Your secret code is 22');
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});