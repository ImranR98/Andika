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

  constructor(private noteService: NotesService, private errorService: ErrorService) { }

  ngOnInit() {
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

}
