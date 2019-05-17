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

  notesBy2: INote[][] = [[]];

  loading: boolean = false;

  ngOnInit() {
    this.userService.isLoggedIn();
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
      if (this.notes) {
        for (let i = 0; i < this.notes.length; i++) {
          if (((i + 1) % 2) == 0) {
            this.notesBy2[this.notesBy2.length - 1].push(this.notes[i]);
            this.notesBy2.push([]);
          } else {
            this.notesBy2[this.notesBy2.length - 1].push(this.notes[i]);
          }
        }
      }
    })
  }

}
