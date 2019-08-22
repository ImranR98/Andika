let dbService = require('./dbService');
const sharp = require('sharp');

convertDbNoteToAppNote = (dbNote) => {
    let tags = dbNote.tags.split(', ');
    if (tags[0] === 'undefined') {
        tags = [];
    }
    return {
        noteId: dbNote.note_id,
        title: dbNote.title,
        note: dbNote.note,
        tags: tags,
        archived: dbNote.archived,
        pinned: dbNote.pinned,
        createdDate: dbNote.created_date,
        modifiedDate: dbNote.modified_date,
        imageType: dbNote.image_type,
        imageBase64: dbNote.image_base_64
    }
}

convertTagsArrayToString = (tags) => {
    let tagsTemp = '';
    for (let i = 0; i < tags.length - 1; i++) {
        tagsTemp += (tags[i] + ', ');
    }
    tagsTemp += tags[tags.length - 1];
    return tagsTemp;
}

resizeBase64Image = (base64Image) => {
    return new Promise((resolve, reject) => {
        if (base64Image) {
            sharp(Buffer.from(base64Image, 'base64')).resize(1000).toBuffer().then((bufferResizedImageBase64) => {
                resolve(bufferResizedImageBase64.toString('base64'));
            }).catch((err) => {
                reject(err);
            });
        } else {
            resolve('')
        }
    })
}

module.exports.getNotes = (userId) => {
    return new Promise((resolve, reject) => {
        dbService.runQueryWithParams({
            query: 'SELECT * FROM NOTES WHERE (USER_ID = $1::int)',
            params: [userId]
        }).then((results) => {
            let notes = [];
            for (let i = 0; i < results.rows.length; i++) {
                notes.push(convertDbNoteToAppNote(results.rows[i]));
            }
            resolve(notes);
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports.addNote = (noteData, userId) => {
    return new Promise((resolve, reject) => {
        let date = new Date();
        let tags = convertTagsArrayToString(noteData.tags);
        for (let property in noteData) {
            if (noteData.hasOwnProperty(property)) {
                if (Object.getOwnPropertyDescriptor(noteData, property).value == null || Object.getOwnPropertyDescriptor(noteData, property).value == undefined) {
                    Object.defineProperty(noteData, property, { value: '' });
                }
            }
        }
        resizeBase64Image(noteData.imageBase64).then((imageBase64Resized) => {
            dbService.runQueryWithParams({
                query: 'INSERT INTO NOTES (USER_ID, TITLE, NOTE, TAGS, ARCHIVED, PINNED, CREATED_DATE, MODIFIED_DATE, IMAGE_TYPE, IMAGE_BASE_64) VALUES($1::int, $2::text, $3::text, $4::text, $5::boolean, $6::boolean, $7::timestamp, $8::timestamp, $9::text, $10::text)',
                params: [userId, noteData.title, noteData.note, tags, noteData.archived, noteData.pinned, date, date, noteData.imageType, imageBase64Resized]
            }).then(() => {
                dbService.runQueryWithParams({
                    query: 'SELECT * FROM NOTES WHERE (USER_ID=$1::int AND TITLE=$2::text AND NOTE=$3::text AND TAGS=$4::text AND ARCHIVED=$5::boolean AND PINNED=$6::boolean AND CREATED_DATE=$7::timestamp AND MODIFIED_DATE=$8::timestamp AND IMAGE_TYPE = $9::text AND IMAGE_BASE_64 = $10::text)',
                    params: [userId, noteData.title, noteData.note, tags, noteData.archived, noteData.pinned, date, date, noteData.imageType, imageBase64Resized]
                }).then((results) => {
                    resolve(convertDbNoteToAppNote(results.rows[results.rows.length - 1]));
                }).catch((err) => {
                    reject(err);
                })
            }).catch((err) => {
                reject(err);
            })
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports.updateNote = (noteData, userId) => {
    return new Promise((resolve, reject) => {
        let date = new Date();
        let tags = convertTagsArrayToString(noteData.tags);
        for (let property in noteData) {
            if (noteData.hasOwnProperty(property)) {
                if (Object.getOwnPropertyDescriptor(noteData, property).value == null || Object.getOwnPropertyDescriptor(noteData, property).value == undefined) {
                    Object.defineProperty(noteData, property, { value: '' });
                }
            }
        }
        resizeBase64Image(noteData.imageBase64).then((imageBase64Resized) => {
            dbService.runQueryWithParams({
                query: 'UPDATE NOTES SET TITLE=$1::text, NOTE=$2::text, TAGS=$3::text, MODIFIED_DATE=$4::timestamp, IMAGE_TYPE = $5::text, IMAGE_BASE_64 = $6::text WHERE (NOTE_ID=$7::int AND USER_ID=$8::int)',
                params: [noteData.title, noteData.note, tags, date, noteData.imageType, imageBase64Resized, noteData.noteId, userId]
            }).then(() => {
                dbService.runQueryWithParams({
                    query: 'SELECT * FROM NOTES WHERE (NOTE_ID=$1::int AND USER_ID=$2::int)',
                    params: [noteData.noteId, userId]
                }).then((results) => {
                    resolve(convertDbNoteToAppNote(results.rows[results.rows.length - 1]));
                }).catch((err) => {
                    reject(err);
                })
            }).catch((err) => {
                reject(err);
            })
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports.deleteNote = (noteId, userId) => {
    return new Promise((resolve, reject) => {
        dbService.runQueryWithParams({
            query: 'DELETE FROM NOTES WHERE (NOTE_ID=$1::int AND USER_ID=$2::int)',
            params: [noteId.noteId, userId]
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports.archiveNote = (noteId, userId) => {
    return new Promise((resolve, reject) => {
        dbService.runQueryWithParams({
            query: 'UPDATE NOTES SET ARCHIVED=true WHERE (NOTE_ID=$1::int AND USER_ID=$2::int)',
            params: [noteId.noteId, userId]
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports.unArchiveNote = (noteId, userId) => {
    return new Promise((resolve, reject) => {
        dbService.runQueryWithParams({
            query: 'UPDATE NOTES SET ARCHIVED=false WHERE (NOTE_ID=$1::int AND USER_ID=$2::int)',
            params: [noteId.noteId, userId]
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports.pinNote = (noteId, userId) => {
    return new Promise((resolve, reject) => {
        dbService.runQueryWithParams({
            query: 'UPDATE NOTES SET PINNED=true WHERE (NOTE_ID=$1::int AND USER_ID=$2::int)',
            params: [noteId.noteId, userId]
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports.unPinNote = (noteId, userId) => {
    return new Promise((resolve, reject) => {
        dbService.runQueryWithParams({
            query: 'UPDATE NOTES SET PINNED=false WHERE (NOTE_ID=$1::int AND USER_ID=$2::int)',
            params: [noteId.noteId, userId]
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports.deleteAllNotes = (userId) => {
    return new Promise((resolve, reject) => {
        dbService.runQueryWithParams({
            query: 'DELETE FROM NOTES WHERE (USER_ID=$1::int)',
            params: [userId]
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        })
    });
}