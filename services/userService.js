const bcrypt = require('bcrypt'); //To encrypt and validate passwords
const nodeMailer = require('nodemailer'); //To send confirmation emails
const dbService = require('./dbService');
const noteService = require('./notesService');

module.exports.registerUser = (registerFormInput) => {
    return new Promise((resolve, reject) => {
        if (registerFormInput.email && registerFormInput.firstName && registerFormInput.lastName && registerFormInput.password) {
            bcrypt.hash(registerFormInput.password, 10).then((encryptedPassword) => {
                let result = '';
                let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let charactersLength = characters.length;
                for (let i = 0; i < charactersLength; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                dbService.runQueryWithParams({
                    query: 'INSERT INTO USERS (EMAIL, FIRST_NAME, LAST_NAME, PASSWORD, REGISTRATION_STATUS, REGISTRATION_KEY, REGISTRATION_START_DATE, REGISTRATION_COMPLETE_DATE) VALUES($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::date, null)',
                    params: [registerFormInput.email, registerFormInput.firstName, registerFormInput.lastName, encryptedPassword, 'PENDING', result, new Date()]
                }).then(() => {
                    let transporter = nodeMailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: process.env.ADMIN_EMAIL,
                            pass: process.env.ADMIN_PASSWORD
                        }
                    });
                    let mailOptions = {
                        from: `"${process.env.ADMIN_NAME}" <${process.env.ADMIN_EMAIL}>`,
                        to: [registerFormInput.email],
                        subject: 'Complete your Registration',
                        html:
                            `<p><b>Click the link below to complete your registration:</b></p>
                            <a href="${process.env.EMAIL_URL}/home?key=${result}">${process.env.EMAIL_URL}/home?key=${result}</a>`
                    };
                    transporter.sendMail(mailOptions).then((info) => {
                        resolve();
                    }).catch((err) => {
                        dbService.runQueryWithParams({
                            query: 'DELETE FROM USERS WHERE (REGISTRATION_KEY = $1::text);',
                            params: [result]
                        })
                        reject(err);
                    })
                }).catch((err) => {
                    if (err.code == 23505) {
                        reject(`${registerFormInput.email} already attempted registration`);
                    } else {
                        reject(err);
                    }
                })
            }).catch((err) => {
                reject(err);
            })
        } else {
            reject('Form Input is not valid');
        }
    });
}

module.exports.completeRegistration = (key) => {
    return new Promise((resolve, reject) => {
        if (key.key) {
            dbService.runQueryWithParams({
                query: 'SELECT * FROM USERS WHERE (REGISTRATION_KEY=$1::text AND REGISTRATION_STATUS=$2::text)',
                params: [key.key, 'PENDING']
            }).then((results) => {
                if (results.rows.length > 0) {
                    dbService.runQueryWithParams({
                        query: 'UPDATE USERS SET REGISTRATION_STATUS=$1::text, REGISTRATION_COMPLETE_DATE=$2::date',
                        params: ['COMPLETE', new Date()]
                    }).then(() => {
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    })
                } else {
                    reject('Registration complete link is invalid');
                }
            }).catch((err) => {
                reject(err);
            })
        } else {
            reject('Key not found');
        }
    });
}

module.exports.login = (loginFormInput) => {
    return new Promise((resolve, reject) => {
        if (loginFormInput.email && loginFormInput.password) {
            dbService.runQueryWithParams({
                query: 'SELECT * FROM USERS WHERE EMAIL=$1::text AND REGISTRATION_STATUS=$2::text',
                params: [loginFormInput.email, 'COMPLETE']
            }).then((results) => {
                if (results.rows.length > 0) {
                    bcrypt.compare(loginFormInput.password, results.rows[0].password).then((res) => {
                        if (res) {
                            resolve(
                                {
                                    email: results.rows[0].email,
                                    firstName: results.rows[0].first_name,
                                    lastName: results.rows[0].last_name
                                }
                            );
                        } else {
                            reject('Incorrect Password');
                        }
                    })
                } else {
                    reject(`No registered account found for ${loginFormInput.email}`);
                }
            }).catch((err) => {
                reject(err);
            })
        } else {
            reject('Form Input is not valid');
        }
    });
}

module.exports.deleteAccount = (deleteFormInput) => {
    return new Promise((resolve, reject) => {
        if (deleteFormInput.email && deleteFormInput.password) {
            dbService.runQueryWithParams({
                query: 'SELECT * FROM USERS WHERE EMAIL=$1::text AND REGISTRATION_STATUS=$2::text',
                params: [deleteFormInput.email, 'COMPLETE']
            }).then((results) => {
                if (results.rows.length > 0) {
                    bcrypt.compare(deleteFormInput.password, results.rows[0].password).then((res) => {
                        if (res) {
                            noteService.deleteAllNotes(results.rows[0].id).then(() => {
                                dbService.runQueryWithParams({
                                    query: 'DELETE FROM USERS WHERE ID=$1::integer',
                                    params: [results.rows[0].id]
                                }).then(() => {
                                    resolve();
                                }).catch((err) => {
                                    reject(err);
                                })
                            }).catch((err) => {
                                reject(err);
                            })
                        } else {
                            reject('Incorrect Password');
                        }
                    }).catch((err) => {
                        reject(err);
                    })
                } else {
                    reject(`No registered account found for ${deleteFormInput.email}`);
                }
            }).catch((err) => {
                reject(err);
            })
        } else {
            reject('Form Input is not valid');
        }
    })
}

module.exports.getuserId = (email) => {
    return new Promise((resolve, reject) => {
        dbService.runQueryWithParams({
            query: 'SELECT ID FROM USERS WHERE EMAIL=$1::text',
            params: [email]
        }).then((results) => {
            if (results.rows.length > 0) {
                resolve(results.rows[0].id)
            } else {
                reject(`No registered account found for ${deleteFormInput.email}`);
            }
        }).catch((err) => {
            reject(err);
        })
    })
}