import { Component, OnInit, Input } from '@angular/core';
import { INote } from '../models/notes.models';
import { NotesService } from '../services/notes.service';
import { ErrorService } from '../services/error.service';
import { MatDialog } from '@angular/material';
import { NoteDialogComponent } from './note-dialog/note-dialog.component';
import { DeleteNoteDialogComponent } from './delete-note-dialog/delete-note-dialog.component';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.sass']
})
export class NoteComponent implements OnInit {

  @Input() note: INote;

  waiting: boolean = false;
  viewText = '';
  viewLength = 200;
  created: any = null;
  modified: any = null;

  constructor(private noteService: NotesService, private errorService: ErrorService, private dialog: MatDialog) { }

  ngOnInit() {
    if (this.note.note.length > 50) {
      this.viewText = this.note.note.substr(0, this.viewLength - 3);
      this.viewText += '...';
    } else {
      this.viewText = this.note.note;
    }
    this.created = new Date(this.note.createdDate);
    this.modified = new Date(this.note.modifiedDate);
    let today = new Date();

    if (today.toDateString() == this.created.toDateString()) {
      this.created = 'Today' + ', ' + this.created.getHours() + ':' + this.created.getMinutes();
    } else {
      this.created = this.created.toDateString() + ', ' + this.created.getHours() + ':' + this.created.getMinutes();
    }

    if (today.toDateString() == this.modified.toDateString()) {
      this.modified = 'Today' + ', ' + this.modified.getHours() + ':' + this.modified.getMinutes();
    } else {
      this.modified = this.modified.toDateString() + ', ' + this.modified.getHours() + ':' + this.modified.getMinutes();
    }
  }

  deleteNote() {
    this.waiting = true;
    this.dialog.open(DeleteNoteDialogComponent, {
      width: '250px',
    }).afterClosed().subscribe((val) => {
      if (val) {
        this.noteService.deleteNote(this.note.id).then(() => {
          this.waiting = false;
        }).catch((err) => {
          this.errorService.showError(err);
          this.waiting = false;
        });
      } else {
        this.waiting = false;
      }
    });
  }

  archiveNote() {
    this.waiting = true;
    this.noteService.archiveNote(this.note.id).then(() => {
      this.waiting = false;
    }).catch((err) => {
      this.errorService.showError(err);
      this.waiting = false;
    });
  }

  unArchiveNote() {
    this.waiting = true;
    this.noteService.unArchiveNote(this.note.id).then(() => {
      this.waiting = false;
    }).catch((err) => {
      this.errorService.showError(err);
      this.waiting = false;
    });
  }

  openEditor() {
    if (!this.waiting) {
      this.dialog.open(NoteDialogComponent, {
        data: this.note,
        height: '100vh',
        width: '100vw',
        maxHeight: '100vh',
        maxWidth: '100vw',
      });
    }
  }

}
