let userService = require('./userService');
let dbService = require('./dbService');

convertDbNoteToAppNote = (dbNote) => {
    let tags = dbNote.tags.split(', ');
    if (tags[0] === 'undefined') {
        tags = [];
    }
    return {
        id: dbNote.id,
        title: dbNote.title,
        note: dbNote.note,
        tags: tags,
        archived: dbNote.archived,
        createdDate: dbNote.created_date,
        modifiedDate: dbNote.modified_date
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

module.exports.getNotes = (email) => {
    return new Promise((resolve, reject) => {
        userService.getuserId(email.email).then((id) => {
            dbService.runQueryWithParams({
                query: 'SELECT * FROM NOTES WHERE (USERID = $1::int)',
                params: [id]
            }).then((results) => {
                let notes = [];
                for (let i = 0; i < results.rows.length; i++) {
                    notes.push(convertDbNoteToAppNote(results.rows[i]));
                }
                resolve(notes);
            }).catch((err) => {
                reject(err);
            })
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports.addNote = (noteData) => {
    return new Promise((resolve, reject) => {
        userService.getuserId(noteData.email).then((id) => {
            let date = new Date();
            let tags = convertTagsArrayToString(noteData.tags);
            dbService.runQueryWithParams({
                query: 'INSERT INTO NOTES (USERID, TITLE, NOTE, TAGS, ARCHIVED, CREATED_DATE, MODIFIED_DATE) VALUES($1::int, $2::text, $3::text, $4::text, $5::boolean, $6::date, $6::date)',
                params: [id, noteData.title, noteData.note, tags, noteData.archived, date]
            }).then(() => {
                dbService.runQueryWithParams({
                    query: 'SELECT * FROM NOTES WHERE (USERID=$1::int AND TITLE=$2::text AND NOTE=$3::text AND TAGS=$4::text AND ARCHIVED=$5::boolean AND CREATED_DATE=$6::date AND MODIFIED_DATE=$6::date)',
                    params: [id, noteData.title, noteData.note, tags, noteData.archived, date]
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

module.exports.updateNote = (note) => {
    return new Promise((resolve, reject) => {
        let date = new Date();
        let tags = convertTagsArrayToString(note.tags);
        dbService.runQueryWithParams({
            query: 'UPDATE NOTES SET TITLE=$2::text, NOTE=$3::text, TAGS=$4::text, MODIFIED_DATE=$5::date WHERE (ID=$1::int)',
            params: [note.id, note.title, note.note, tags, date]
        }).then(() => {
            dbService.runQueryWithParams({
                query: 'SELECT * FROM NOTES WHERE (ID=$1::int)',
                params: [note.id]
            }).then((results) => {
                resolve(convertDbNoteToAppNote(results.rows[results.rows.length - 1]));
            }).catch((err) => {
                reject(err);
            })
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports.deleteNote = (noteId) => {
    return new Promise((resolve, reject) => {
        dbService.runQueryWithParams({
            query: 'DELETE FROM NOTES WHERE (ID=$1::int)',
            params: [noteId.id]
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports.archiveNote = (noteId) => {
    return new Promise((resolve, reject) => {
        dbService.runQueryWithParams({
            query: 'UPDATE NOTES SET ARCHIVED=true WHERE (ID=$1::int)',
            params: [noteId.id]
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports.unArchiveNote = (noteId) => {
    return new Promise((resolve, reject) => {
        dbService.runQueryWithParams({
            query: 'UPDATE NOTES SET ARCHIVED=false WHERE (ID=$1::int)',
            params: [noteId.id]
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports.deleteAllNotes = (userid) => {
    return new Promise((resolve, reject) => {
        dbService.runQueryWithParams({
            query: 'DELETE FROM NOTES WHERE (USERID=$1::int)',
            params: [userid]
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        })
    });
}