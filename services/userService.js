const bcrypt = require('bcrypt'); //To encrypt and validate passwords
const nodeMailer = require('nodemailer'); //To send confirmation emails
const dbService = require('./dbService');
const favoriteService = require('./favoriteService');

convertDBUserToAppUser = (DBUser) => {
    return {
        userId: DBUser.user_id,
        email: DBUser.email,
        firstName: DBUser.first_name,
        lastName: DBUser.last_name,
        userType: DBUser.user_type
    }
}

module.exports.registerUser = (registerFormInput, currentDomain) => {
    return new Promise((resolve, reject) => {
        if (registerFormInput.email && registerFormInput.firstName && registerFormInput.lastName && registerFormInput.password && registerFormInput.passwordConfirm) {
            if (registerFormInput.password == registerFormInput.passwordConfirm) {
                bcrypt.hash(registerFormInput.password, 10).then((encryptedPassword) => {
                    let result = '';
                    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let charactersLength = characters.length;
                    for (let i = 0; i < charactersLength; i++) {
                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                    dbService.runQueryWithParams({
                        query: 'DELETE FROM USERS WHERE (EMAIL=$1::text AND REGISTRATION_STATUS=$2::text)',
                        params: [registerFormInput.email, 'PENDING']
                    }).then(() => {
                        dbService.runQueryWithParams({
                            query: 'INSERT INTO USERS (EMAIL, FIRST_NAME, LAST_NAME, PASSWORD, REGISTRATION_STATUS, REGISTRATION_KEY, REGISTRATION_START_DATE, REGISTRATION_COMPLETE_DATE, USER_TYPE) VALUES($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::timestamp, null, $8::text)',
                            params: [registerFormInput.email, registerFormInput.firstName, registerFormInput.lastName, encryptedPassword, 'PENDING', result, new Date(), 'REGULAR']
                        }).then(() => {
                            let transporter = nodeMailer.createTransport(JSON.parse(process.env.NODEMAILER_TRANSPORT_JSON));
                            let mailOptions = {
                                from: `"${process.env.NODEMAILER_NAME}" <${process.env.NODEMAILER_EMAIL}>`,
                                to: [registerFormInput.email],
                                subject: 'Complete your Registration',
                                html:
                                    `<p><b>Click the link below to complete your registration:</b></p>
                            <a href="http://${currentDomain}/completeRegistration?key=${result}">http://${currentDomain}/completeRegistration?key=${result}</a>`
                            };

                            if (process.env.NODEMAILER_MAILOPTIONS_AUTH) {
                                mailOptions.auth = JSON.parse(process.env.NODEMAILER_MAILOPTIONS_AUTH);
                                if (process.env.NODEMAILER_MAILOPTIONS_AUTH_EXPIRESIN) {
                                    mailOptions.auth.expires = new Date().getTime() + parseInt(process.env.NODEMAILER_MAILOPTIONS_AUTH_EXPIRESIN);
                                }
                            }

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
                                reject(`${registerFormInput.email} is already registered`);
                            } else {
                                reject(err);
                            }
                        })
                    }).catch((err) => {
                        reject(err);
                    })
                }).catch((err) => {
                    reject(err);
                })
            } else {
                reject('Passwords do not match')
            }
        } else {
            reject('Form Input is not valid');
        }
    });
}

module.exports.completeRegistration = (requestQueries) => {
    return new Promise((resolve, reject) => {
        if (requestQueries.key) {
            dbService.runQueryWithParams({
                query: 'SELECT * FROM USERS WHERE (REGISTRATION_KEY=$1::text AND REGISTRATION_STATUS=$2::text)',
                params: [requestQueries.key, 'PENDING']
            }).then((results) => {
                if (results.rows.length > 0) {
                    dbService.runQueryWithParams({
                        query: 'UPDATE USERS SET REGISTRATION_STATUS=$1::text, REGISTRATION_COMPLETE_DATE=$2::timestamp WHERE (REGISTRATION_KEY=$3::text AND REGISTRATION_STATUS=$4::text)',
                        params: ['COMPLETE', new Date(), requestQueries.key, 'PENDING']
                    }).then(() => {
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    })
                } else {
                    reject('Registration completion link is invalid');
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
                            resolve(convertDBUserToAppUser(results.rows[0]));
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

module.exports.updateAccount = (updateUserFormInput, userId) => {
    return new Promise((resolve, reject) => {
        if (updateUserFormInput.firstName && updateUserFormInput.lastName) {
            dbService.runQueryWithParams({
                query: 'UPDATE USERS SET FIRST_NAME=$1::text, LAST_NAME=$2::text WHERE USER_ID=$3::integer',
                params: [updateUserFormInput.firstName, updateUserFormInput.lastName, userId]
            }).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            })
        } else {
            reject('Form Input is not valid')
        }
    })
}

module.exports.updatePassword = (updatePasswordFormInput, userId) => {
    return new Promise((resolve, reject) => {
        if (updatePasswordFormInput.password && updatePasswordFormInput.newPassword && updatePasswordFormInput.passwordConfirm) {
            if (updatePasswordFormInput.newPassword == updatePasswordFormInput.passwordConfirm) {
                dbService.runQueryWithParams({
                    query: 'SELECT PASSWORD FROM USERS WHERE USER_ID=$1::integer',
                    params: [userId]
                }).then((results) => {
                    if (results.rows.length > 0) {
                        bcrypt.compare(updatePasswordFormInput.password, results.rows[0].password).then((res) => {
                            if (res) {
                                bcrypt.hash(updatePasswordFormInput.newPassword, 10).then((encryptedPassword) => {
                                    dbService.runQueryWithParams({
                                        query: 'UPDATE USERS SET PASSWORD=$1::text WHERE USER_ID=$2::integer',
                                        params: [encryptedPassword, userId]
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
                        reject(`Account not found`);
                    }
                }).catch((err) => {
                    reject(err);
                })
            } else {
                reject('Passwords do not match');
            }
        } else {
            reject('Form Input is not valid');
        }
    })
}

module.exports.deleteAccount = (password, userId) => {
    return new Promise((resolve, reject) => {
        if (password.password) {
            dbService.runQueryWithParams({
                query: 'SELECT PASSWORD FROM USERS WHERE USER_ID=$1::integer',
                params: [userId]
            }).then((results) => {
                if (results.rows.length > 0) {
                    bcrypt.compare(password.password, results.rows[0].password).then((res) => {
                        if (res) {
                            favoriteService.unFavoriteAllProducts(userId).then(() => {
                                dbService.runQueryWithParams({
                                    query: 'DELETE FROM PASSWORD_RESETS WHERE USER_ID=$1::integer',
                                    params: [userId]
                                }).then(() => {
                                    dbService.runQueryWithParams({
                                        query: 'DELETE FROM USERS WHERE USER_ID=$1::integer',
                                        params: [userId]
                                    }).then(() => {
                                        resolve();
                                    }).catch((err) => {
                                        reject(err);
                                    })
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
                    reject(`Account not found`);
                }
            }).catch((err) => {
                reject(err);
            })
        } else {
            reject('Form Input is not valid');
        }
    })
}

module.exports.checkUserAdmin = (userId) => {
    return new Promise((resolve, reject) => {
        dbService.runQueryWithParams({
            query: 'SELECT USER_TYPE FROM USERS WHERE USER_ID=$1::int',
            params: [userId]
        }).then((results) => {
            if (results.rows.length > 0) {
                if (results.rows[0].user_type.toLowerCase() == 'admin') {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                reject(`No registered account found for ${userId}`);
            }
        }).catch((err) => {
            reject(err);
        })
    })
}

module.exports.getUserId = (email) => {
    return new Promise((resolve, reject) => {
        dbService.runQueryWithParams({
            query: 'SELECT USER_ID FROM USERS WHERE EMAIL=$1::text',
            params: [email]
        }).then((results) => {
            if (results.rows.length > 0) {
                resolve(results.rows[0].user_id);
            } else {
                reject(`No registered account found for ${email}`);
            }
        }).catch((err) => {
            reject(err);
        })
    })
}

module.exports.resetPassword = (passwordResetFormInput, currentDomain) => {
    return new Promise((resolve, reject) => {
        if (passwordResetFormInput.email && passwordResetFormInput.password && passwordResetFormInput.passwordConfirm) {
            if (passwordResetFormInput.password == passwordResetFormInput.passwordConfirm) {
                bcrypt.hash(passwordResetFormInput.password, 10).then((encryptedPassword) => {
                    let result = '';
                    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let charactersLength = characters.length;
                    for (let i = 0; i < charactersLength; i++) {
                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                    module.exports.getUserId(passwordResetFormInput.email).then((id) => {
                        dbService.runQueryWithParams({
                            query: 'DELETE FROM PASSWORD_RESETS WHERE(USER_ID=$1::int)',
                            params: [id]
                        }).then(() => {
                            dbService.runQueryWithParams({
                                query: 'INSERT INTO PASSWORD_RESETS VALUES($1::int, $2::text, $3::text)',
                                params: [id, encryptedPassword, result]
                            }).then(() => {
                                let transporter = nodeMailer.createTransport(JSON.parse(process.env.NODEMAILER_TRANSPORT_JSON));
                                let mailOptions = {
                                    from: `"${process.env.NODEMAILER_NAME}" <${process.env.NODEMAILER_EMAIL}>`,
                                    to: [passwordResetFormInput.email],
                                    subject: 'Reset your Password',
                                    html:
                                        `<p><b>Click the link below to complete your password reset:</b></p>
                                <a href="http://${currentDomain}/completePasswordReset?key=${result}">http://${currentDomain}/completePasswordReset?key=${result}</a>`
                                };

                                if (process.env.NODEMAILER_MAILOPTIONS_AUTH) {
                                    mailOptions.auth = JSON.parse(process.env.NODEMAILER_MAILOPTIONS_AUTH);
                                    if (process.env.NODEMAILER_MAILOPTIONS_AUTH_EXPIRESIN) {
                                        mailOptions.auth.expires = new Date().getTime() + parseInt(process.env.NODEMAILER_MAILOPTIONS_AUTH_EXPIRESIN);
                                    }
                                }

                                transporter.sendMail(mailOptions).then((info) => {
                                    resolve();
                                }).catch((err) => {
                                    dbService.runQueryWithParams({
                                        query: 'DELETE FROM USERS PASSWORD_RESETS (RESET_KEY = $1::text);',
                                        params: [result]
                                    })
                                    reject(err);
                                })
                            }).catch((err) => {
                                reject(err);
                            })
                        }).catch((err) => {
                            reject(err);
                        })
                    }).catch((err) => {
                        reject(err);
                    })
                }).catch((err) => {
                    reject(err);
                })
            } else {
                reject('Passwords do not match')
            }
        } else {
            reject('Form Input is not valid');
        }
    });
}

module.exports.completePasswordReset = (requestQueries) => {
    return new Promise((resolve, reject) => {
        if (requestQueries.key) {
            dbService.runQueryWithParams({
                query: 'SELECT * FROM PASSWORD_RESETS WHERE (RESET_KEY=$1::text)',
                params: [requestQueries.key]
            }).then((results) => {
                if (results.rows.length > 0) {
                    dbService.runQueryWithParams({
                        query: 'UPDATE USERS SET PASSWORD=$1::text',
                        params: [results.rows[0].new_password]
                    }).then(() => {
                        dbService.runQueryWithParams({
                            query: 'DELETE FROM PASSWORD_RESETS WHERE (RESET_KEY=$1::text)',
                            params: [results.rows[0].reset_key]
                        }).then(() => {
                            resolve();
                        }).catch((err) => {
                            reject(err);
                        })
                    }).catch((err) => {
                        reject(err);
                    })
                } else {
                    reject('Password reset completion link is invalid');
                }
            }).catch((err) => {
                reject(err);
            })
        } else {
            reject('Key not found');
        }
    });
}