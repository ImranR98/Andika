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
    requestProperty: 'jwt',
    algorithms: ['RS256']
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

//Start Server (make sure .env file exists and contains variables listed in README.md)
app.listen(HTTP_PORT, function () {
    console.log('Andika listening on: ' + HTTP_PORT)
});