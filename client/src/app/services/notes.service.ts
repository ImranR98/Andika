import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment';
import { IAddNote, INote, IUpdateNote } from '../models/notes.models';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient, private userService: UserService, private errorService: ErrorService) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
  };

  //Make User data into an Observable
  notesSource = new BehaviorSubject<any>(null);
  notes = this.notesSource.asObservable();

  updateNotes(notes: any) {
    this.notesSource.next(notes);
  }

  getCurrentNotes() {
    return this.notesSource.value;
  }

  resetNotesIfNoUser() {
    this.userService.user.subscribe((user) => {
      if (!user) {
        this.updateNotes(null);
      }
    })
  }

  ifNotes() {
    let temp = this.getCurrentNotes();
    let valid = false;
    if (temp != null && temp != undefined) {
      if (typeof temp == 'object') {
        if (temp.length > 0) {
          valid = true;
        }
      }
    }
    return valid;
  }

  getNotes() {
    return new Promise<void>((resolve, reject) => {
      this.http.post('/api/getNotes', this.httpOptions).toPromise().then((notes) => {
        this.updateNotes(notes);
        resolve();
      }).catch((err) => {
        this.errorService.showError(err, () => this.getNotes());
        reject(err);
      })
    })
  }

  updateNote(noteData: IUpdateNote) {
    return new Promise<void>((resolve, reject) => {
      this.http.post('/api/updateNote', noteData, this.httpOptions).toPromise<any>().then((updatedNote: INote) => {
        let temp = this.getCurrentNotes();
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].noteId == updatedNote.noteId) {
            temp[i] = updatedNote;
          }
        }
        this.updateNotes(temp);
        this.errorService.showSimpleSnackBar('Saved');
        resolve();
      }).catch((err) => {
        this.errorService.showError(err, () => this.updateNote(noteData));
        reject(err);
      });
    })
  }

  addNote(noteData: IAddNote) {
    return new Promise<void>((resolve, reject) => {
      this.http.post('/api/addNote', noteData, this.httpOptions).toPromise<any>().then((newNote: INote) => {
        let temp = this.getCurrentNotes();
        temp.push(newNote);
        this.updateNotes(temp);
        this.errorService.showSimpleSnackBar('Saved');
        resolve();
      }).catch((err) => {
        this.errorService.showError(err, () => this.addNote(noteData));
        reject(err);
      });
    })
  }

  deleteNote(noteId: number) {
    return new Promise<void>((resolve, reject) => {
      this.http.post('/api/deleteNote', { noteId: noteId }, this.httpOptions).toPromise().then(() => {
        let temp = this.getCurrentNotes();
        let temp2 = [];
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].noteId != noteId) {
            temp2.push(temp[i]);
          }
        }
        this.updateNotes(temp2);
        this.errorService.showSimpleSnackBar('Deleted');
        resolve();
      }).catch((err) => {
        this.errorService.showError(err, () => this.deleteNote(noteId));
        reject(err);
      });
    })
  }

  archiveNote(noteId: number) {
    return new Promise<void>((resolve, reject) => {
      this.http.post('/api/archiveNote', { noteId: noteId }, this.httpOptions).toPromise().then(() => {
        let temp = this.getCurrentNotes();
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].noteId === noteId) {
            temp[i].archived = true;
          }
        }
        this.updateNotes(temp);
        this.errorService.showSimpleSnackBar('Archived');
        resolve();
      }).catch((err) => {
        this.errorService.showError(err, () => this.archiveNote(noteId));
        reject(err);
      });
    })
  }

  unArchiveNote(noteId: number) {
    return new Promise<void>((resolve, reject) => {
      this.http.post('/api/unArchiveNote', { noteId: noteId }, this.httpOptions).toPromise().then(() => {
        let temp = this.getCurrentNotes();
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].noteId === noteId) {
            temp[i].archived = false;
          }
        }
        this.updateNotes(temp);
        this.errorService.showSimpleSnackBar('Un-Archived');
        resolve();
      }).catch((err) => {
        this.errorService.showError(err, () => this.unArchiveNote(noteId));
        reject(err);
      });
    })
  }

  pinNote(noteId: number) {
    return new Promise<void>((resolve, reject) => {
      this.http.post('/api/pinNote', { noteId: noteId }, this.httpOptions).toPromise().then(() => {
        let temp = this.getCurrentNotes();
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].noteId === noteId) {
            temp[i].pinned = true;
          }
        }
        this.updateNotes(temp);
        this.errorService.showSimpleSnackBar('Pinned');
        resolve();
      }).catch((err) => {
        this.errorService.showError(err, () => this.pinNote(noteId));
        reject(err);
      });
    })
  }

  unPinNote(noteId: number) {
    return new Promise<void>((resolve, reject) => {
      this.http.post('/api/unPinNote', { noteId: noteId }, this.httpOptions).toPromise().then(() => {
        let temp = this.getCurrentNotes();
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].noteId === noteId) {
            temp[i].pinned = false;
          }
        }
        this.updateNotes(temp);
        this.errorService.showSimpleSnackBar('Un-Pinned');
        resolve();
      }).catch((err) => {
        this.errorService.showError(err, () => this.unPinNote(noteId));
        reject(err);
      });
    })
  }

}
