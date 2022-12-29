const fs = require('fs')
const path = require('path');
const http = require('http');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const cookieSession = require('cookie-session');
require('dotenv').config();

const app = express();

const config = {
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        COOKIE_KEY_1: process.env.COOKIE_KEY_1,
        COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

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

//When we save the session to the cookie
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//When we read or load the session from the cookie
passport.deserializeUser((id, done) => {
    // user.findBuId(id).then(user => {
    //     done(null, obj);
    // }) //req.user
    done(null, id);
});

app.use(helmet());
app.use(cookieSession({
    name: 'Session',
    maxAge: 1000 * 60 * 60 * 24,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
}))
app.use(passport.initialize());
app.use(passport.session());

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
        scope: ['email'],
        callbackURL: '/auth/google/callback'
    })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failure',
        successRedirect: '/',
        session: true,
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