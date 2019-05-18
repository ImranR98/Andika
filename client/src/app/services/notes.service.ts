import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
  };

  //Make User data into an Observable
  notesSource = new BehaviorSubject(null);
  notes = this.notesSource.asObservable();

  updateNotes(notes) {
    this.notesSource.next(notes);
  }

  getCurrentNotes() {
    return this.notesSource.value;
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
    return new Promise((resolve, reject) => {
      this.http.post(environment.hostUrl + '/getNotes', { email: this.userService.getUser().email }, this.httpOptions).toPromise().then((notes) => {
        this.updateNotes(notes);
        resolve();
      }).catch((err) => {
        reject(err);
      })
    })
  }

  deleteNote(id) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.hostUrl + '/deleteNote', { id: id }, this.httpOptions).toPromise().then(() => {
        let temp = this.getCurrentNotes();
        let temp2 = [];
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].id != id) {
            temp2.push(temp[i]);
          }
        }
        this.updateNotes(temp2);
        resolve();
      }).catch((err) => {
        reject(err);
      });
    })
  }

  archiveNote(id) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.hostUrl + '/archiveNote', { id: id }, this.httpOptions).toPromise().then(() => {
        let temp = this.getCurrentNotes();
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].id === id) {
            temp[i].archived = true;
          }
        }
        this.updateNotes(temp);
        resolve();
      }).catch((err) => {
        reject(err);
      });
    })
  }

  unArchiveNote(id) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.hostUrl + '/unArchiveNote', { id: id }, this.httpOptions).toPromise().then(() => {
        let temp = this.getCurrentNotes();
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].id === id) {
            temp[i].archived = false;
          }
        }
        this.updateNotes(temp);
        resolve();
      }).catch((err) => {
        reject(err);
      });
    })
  }

}
