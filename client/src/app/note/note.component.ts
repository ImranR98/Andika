import { Component, OnInit, Input } from '@angular/core';
import { INote } from '../models/notes.models';
import { NotesService } from '../services/notes.service';
import { ErrorService } from '../services/error.service';

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

  constructor(private noteService: NotesService, private errorService: ErrorService) { }

  ngOnInit() {
    if (this.note.note.length > 50) {
      this.viewText = this.note.note.substr(0, this.viewLength - 3);
      this.viewText += '...';
    } else {
      this.viewText = this.note.note;
    }
  }

  deleteNote() {
    this.waiting = true;
    this.noteService.deleteNote(this.note.id).then(() => {
      this.waiting = false;
    }).catch((err) => {
      this.errorService.showError(err);
      this.waiting = false;
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

}
