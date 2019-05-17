import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NotesService } from '../services/notes.service';
import { INote } from '../models/notes.models';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.sass']
})
export class NotesComponent implements OnInit {

  constructor(private userService: UserService, private notesService: NotesService, private errorService: ErrorService) { }

  notes: INote[];

  loading: boolean = false;

  ngOnInit() {
    this.userService.isLoggedIn();
    if (!this.notesService.ifNotes()) {
      this.loading = true;
      this.notesService.getNotes().then((notes) => {
        this.loading = false;
        this.notesService.updateNotes(notes);
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
    })
  }

}
