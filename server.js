//Add required Modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const clientDir = __dirname + '/client';

const userService = require('./services/userService');
const noteService = require('./services/notesService');

//Set folder where compiled client App is located
app.use(express.static(clientDir + '/dist/client'));

//Set folder where book images are located
app.use('/static', express.static(__dirname + '/static'));

//Enables parsing of request bodies
app.use(bodyParser.json({ extended: true, limit: '10000kb' }));

//Enables client to access the server from localhost, only needed in local development
let allowCrossDomain = function (req, res, next) {
    let valid = false;
    if (req.header('origin')) {
        if (req.header('origin').indexOf('localhost') !== -1) {
            valid = true;
        }
    }
    if (valid) {
        res.header('Access-Control-Allow-Origin', req.header('origin'));
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    next();
}
app.use(allowCrossDomain);

//======================================
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

//======================================
let decodeJWTUserId = function (req, res, next) {
    if (req.jwt) {
        if (req.jwt.sub) {
            req.jwt.sub = JSON.parse(req.jwt.sub);
        }
    }
    next();
}

checkIfAuthenticated = expressJwt({
    secret: process.env.RSA_PUBLIC_KEY.replaceAll('\\n', '\n'),
    requestProperty: 'jwt'
});

//======================================
app.post('/register', (req, res) => {
    userService.registerUser(req.body, req.headers.host).then(() => {
        res.send();
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
});

app.get('/completeRegistration', (req, res) => {
    userService.completeRegistration(req.query).then(() => {
        res.send('Registration was successful, you can close this page');
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/login', (req, res) => {
    userService.login(req.body).then((user) => {
        const jwtBearerToken = jwt.sign({}, process.env.RSA_PRIVATE_KEY.replaceAll('\\n', '\n'), {
            algorithm: 'RS256',
            expiresIn: parseInt(process.env.EXPIRES_IN),
            subject: JSON.stringify(user.userId)
        });
        res.json({ jwtToken: jwtBearerToken, user: user });
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/deleteAccount', checkIfAuthenticated, decodeJWTUserId, (req, res) => {
    userService.deleteAccount(req.body, req.jwt.sub).then(() => {
        res.send();
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/updateAccount', checkIfAuthenticated, decodeJWTUserId, (req, res) => {
    userService.updateAccount(req.body, req.jwt.sub).then(() => {
        res.send();
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/updatePassword', checkIfAuthenticated, decodeJWTUserId, (req, res) => {
    userService.updatePassword(req.body, req.jwt.sub).then(() => {
        res.send();
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/resetPassword', (req, res) => {
    userService.resetPassword(req.body, req.headers.host).then(() => {
        res.send();
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.get('/completePasswordReset', (req, res) => {
    userService.completePasswordReset(req.query).then(() => {
        res.send('Password reset was successful, you can close this page');
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

//======================================
app.post('/getNotes', checkIfAuthenticated, decodeJWTUserId, (req, res) => {
    noteService.getNotes(req.jwt.sub).then((notes) => {
        res.send(notes);
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/addNote', checkIfAuthenticated, decodeJWTUserId, (req, res) => {
    noteService.addNote(req.body, req.jwt.sub).then((note) => {
        res.send(note);
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/updateNote', checkIfAuthenticated, decodeJWTUserId, (req, res) => {
    noteService.updateNote(req.body, req.jwt.sub).then((note) => {
        res.send(note);
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/deleteNote', checkIfAuthenticated, decodeJWTUserId, (req, res) => {
    noteService.deleteNote(req.body, req.jwt.sub).then(() => {
        res.send();
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/archiveNote', checkIfAuthenticated, decodeJWTUserId, (req, res) => {
    noteService.archiveNote(req.body, req.jwt.sub).then(() => {
        res.send();
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/unArchiveNote', checkIfAuthenticated, decodeJWTUserId, (req, res) => {
    noteService.unArchiveNote(req.body, req.jwt.sub).then(() => {
        res.send();
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/pinNote', checkIfAuthenticated, decodeJWTUserId, (req, res) => {
    noteService.pinNote(req.body, req.jwt.sub).then(() => {
        res.send();
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/unPinNote', checkIfAuthenticated, decodeJWTUserId, (req, res) => {
    noteService.unPinNote(req.body, req.jwt.sub).then(() => {
        res.send();
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})
//======================================

//All other routes are handled by the Angular App which is served here
app.get('*', (req, res) => {
    res.sendFile(path.join(clientDir + '/dist/client/index.html'));
});

//Set Port
let HTTP_PORT = process.env.PORT || 8080;

//Start Server
app.listen(HTTP_PORT, function () {
    console.log('app listening on: ' + HTTP_PORT)
});

/*
The following environment variables are required in any environment running this app:
DATABASE_URL - DB URL for storing data (must contain the tables outlined below)
NODEMAILER_NAME - The name used when sending emails using nodemailer
NODEMAILER_SERVICE - The email service used when sending emails using nodemailer
NODEMAILER_EMAIL - The email used when sending emails using nodemailer
NODEMAILER_PASSWORD - The password for the above email address
CONTACT_EMAIL - The email feedback/contact form input is sent to
RSA_PRIVATE_KEY - Private key used for encrypting JWT
RSA_PUBLIC_KEY - Public key corresponding to the above Private key
EXPIRES_IN - Number of seconds each JWT lasts
*/