const fs = require('fs')
const path = require('path');
const http = require('http');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20')
require('dotenv').config();

const app = express();

const config = {
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET
}

const AUTH_OPTIONS = {
    callbackURL: '/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET
};

function verifyCallBack(accessToken, refreshToken, profile, done) {
    console.log('Google Profile', profile);
    done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallBack));

app.use(helmet());
app.use(passport.initialize())

function checkLoggedIn(req, res, next) {
    const isLoggedin = true; //TODO
    if (!isLoggedin) {
        res.status(401).json({
            error: "You must log in"
        });
    } 
    next();
}

app.get('/auth/google/', 
    passport.authenticate('google', {
        scope: ['email']
    })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failure',
        successRedirect: '/',
        session: false,
    }),
    (req, res) => {
    console.log('Google called!')
    }
);

app.get('/failure', (req, res) => {
    res.send('Failed to log in');
})

app.get('/auth/logout', (req, res) => {});

app.get('/secret', checkLoggedIn, (req, res) => {
    res.send('Your secret code is 22');
});

//set up a route to listen to the request 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '.', 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});