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

//Enables parsing of request bodies
app.use(bodyParser.json({ extended: true }));

//Enables client to access the server from localhost, only needed in local development
let allowCrossDomain = (req, res, next) => {
    let valid = false;
    if (req.header('origin')) {
        if (req.header('origin').indexOf('http://localhost') !== -1) {
            valid = true;
        }
    }
    if (valid) {
        res.header('Access-Control-Allow-Origin', req.header('origin'));
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}
app.use(allowCrossDomain);


String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

checkIfAuthenticated = expressJwt({
    secret: process.env.RSA_PUBLIC_KEY.replaceAll('\\n', '\n')
});


//API Routes
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
            subject: user.email
        });
        res.json({
            idToken: jwtBearerToken,
            expiresIn: process.env.EXPIRES_IN,
            user: user
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/deleteAccount', checkIfAuthenticated, (req, res) => {
    userService.deleteAccount(req.body).then(() => {
        res.send();
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/getNotes', checkIfAuthenticated, (req, res) => {
    noteService.getNotes(req.body).then((notes) => {
        res.send(notes);
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/addNote', checkIfAuthenticated, (req, res) => {
    noteService.addNote(req.body).then((note) => {
        res.send(note);
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/updateNote', checkIfAuthenticated, (req, res) => {
    noteService.updateNote(req.body).then((note) => {
        res.send(note);
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/deleteNote', checkIfAuthenticated, (req, res) => {
    noteService.deleteNote(req.body).then(() => {
        res.send();
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/archiveNote', checkIfAuthenticated, (req, res) => {
    noteService.archiveNote(req.body).then(() => {
        res.send();
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

app.post('/unArchiveNote', checkIfAuthenticated, (req, res) => {
    noteService.unArchiveNote(req.body).then(() => {
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
DATABASE_URL - DB URL for storing data
ADMIN_NAME - The name used when sending registration confirmation emails
ADMIN_EMAIL - The email used when sending registration confirmation emails
ADMIN_PASSWORD - The password for the above email
EMAIL_URL - The URL for the application (where register confirmation emails are sent)
RSA_PRIVATE_KEY - Private key used for session
RSA_PUBLIC_KEY - Public key used for session
EXPIRES_IN - Number of seconds each session lasts
*/