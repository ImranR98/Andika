let CryptoJS = require('crypto-js');
//Using RSA_PRIVATE_KEY as Secret for encryting notes, but any long, secret String could be used

let userService = require('./userService');

encryptObject = (object) => {
    return CryptoJS.AES.encrypt(JSON.stringify(object), process.env.RSA_PRIVATE_KEY.replaceAll('\\n', '\n'));
}

decryptObject = (encryptedText) => {
    return JSON.parse((CryptoJS.AES.decrypt(encryptedText.toString(), process.env.RSA_PRIVATE_KEY.replaceAll('\\n', '\n'))).toString(CryptoJS.enc.Utf8));
}

module.exports.addNote = (email) => {
    return new Promise((resolve, reject) => {
        userService.getuserId(email).then((id) => {
            
        }).catch((err) => {
            reject(err);
        })
    });
}