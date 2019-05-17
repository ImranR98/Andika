import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NotesService } from '../services/notes.service';
import { INote } from '../models/notes.models';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.sass']
})
export class NotesComponent implements OnInit {

  constructor(private userService: UserService, private notesService: NotesService) { }

  notes: INote[];

  ngOnInit() {
    this.userService.isLoggedIn();
    if (!this.notesService.ifNotes()) {
      this.notesService.getNotes().then((notes) => {
        this.notesService.updateNotes(notes);
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
