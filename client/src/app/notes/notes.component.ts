import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NotesService } from '../services/notes.service';
import { INote } from '../models/notes.models';
import { ErrorService } from '../services/error.service';
import { MatDialog } from '@angular/material';
import { AddNoteDialogComponent } from './add-note-dialog/add-note-dialog.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.sass']
})
export class NotesComponent implements OnInit {

  constructor(private userService: UserService, private notesService: NotesService, private errorService: ErrorService, private dialog: MatDialog) { }

  notes: INote[];

  notesBy2: INote[][] = [[]];
  notesBy3: INote[][] = [[]];
  notesBy4: INote[][] = [[]];

  loading: boolean = false;

  ngOnInit() {
    this.userService.isLoggedIn();
    this.notesService.resetNotesIfNoUser();
    if (!this.notesService.ifNotes()) {
      this.loading = true;
      this.notesService.getNotes().then(() => {
        this.loading = false;
      }).catch((err) => {
        this.errorService.showError(err);
        this.loading = false;
      });
    }
    this.subscribeToNotes();
  }

  subscribeToNotes() {
    this.notesService.notes.subscribe((notes) => {
      this.notes = notes;
      this.fillDisplayObjects();
    })
  }

  fillDisplayObjects() {
    if (this.notes) {
      this.notesBy2 = [[]];
      this.notesBy3 = [[]];
      this.notesBy4 = [[]];
      for (let i = 0; i < this.notes.length; i++) {
        if (((i + 1) % 2) == 0) {
          this.notesBy2[this.notesBy2.length - 1].push(this.notes[i]);
          this.notesBy2.push([]);
        } else {
          this.notesBy2[this.notesBy2.length - 1].push(this.notes[i]);
        }
        if (((i + 1) % 3) == 0) {
          this.notesBy3[this.notesBy3.length - 1].push(this.notes[i]);
          this.notesBy3.push([]);
        } else {
          this.notesBy3[this.notesBy3.length - 1].push(this.notes[i]);
        } if (((i + 1) % 4) == 0) {
          this.notesBy4[this.notesBy4.length - 1].push(this.notes[i]);
          this.notesBy4.push([]);
        } else {
          this.notesBy4[this.notesBy4.length - 1].push(this.notes[i]);
        }
      }
      for (let i = 0; i < this.notesBy2.length; i++) {
        if (this.notesBy2[i].length == 0) {
          this.notesBy2.splice(i, 1);
        }
      }
      for (let i = 0; i < this.notesBy3.length; i++) {
        if (this.notesBy3[i].length == 0) {
          this.notesBy3.splice(i, 1);
        }
      }
      for (let i = 0; i < this.notesBy4.length; i++) {
        if (this.notesBy4[i].length == 0) {
          this.notesBy4.splice(i, 1);
        }
      }
    }
  }

  addNote() {
    if (!this.loading) {
      this.dialog.open(AddNoteDialogComponent, {
        height: '100vh',
        width: '100vw',
        maxHeight: '100vh',
        maxWidth: '100vw',
      });
    }
  }

}
