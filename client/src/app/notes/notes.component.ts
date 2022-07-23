import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { NotesService } from '../services/notes.service';
import { INote } from '../models/notes.models';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { IUser } from '../models';
import { NoteDialogComponent } from './note/note-dialog/note-dialog.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.sass']
})
export class NotesComponent implements OnInit {

  constructor(private userService: UserService, private notesService: NotesService, private dialog: MatDialog) { }

  @Input() archivesPage: boolean = false;

  loading: boolean = false;

  searchForm = new UntypedFormGroup({
    search: new UntypedFormControl(''),
    showArchived: new UntypedFormControl(false)
  });

  user: IUser | null = null;
  notes: INote[] = [];

  notesBy1: INote[] = [];
  notesBy2: INote[][] = [[]];
  notesBy3: INote[][] = [[]];
  notesBy4: INote[][] = [[]];
  notesBy5: INote[][] = [[]];

  ngOnInit() {
    this.userService.ifLoggedIn();
    this.notesService.resetNotesIfNoUser();
    if (!this.notesService.ifNotes()) {
      this.loading = true;
      this.notesService.getNotes().then(() => {
        this.loading = false;
      }).catch((err) => {
        this.loading = false;
      });
    }
    this.subscribeToNotes();

    if (!this.notesService.getCurrentNotes()) {
      this.loading = true;
      this.notesService.getNotes().then(() => {
        if (this.userService.ifLoggedIn()) {
          this.loading = false;
        } else {
          this.loading = false;
        }
      }).catch((err) => {
        this.loading = false;
      })
    } else {
      this.loading = false;
    }

    this.subscribeToUser();
    this.subscribeToNotes();
  }

  //Sets userType to show/hide Admin controls
  subscribeToUser() {
    this.userService.user.subscribe((user: IUser | null) => {
      if (user) {
        this.user = user;
      }
    })
  }

  subscribeToNotes() {
    this.notesService.notes.subscribe((notes: INote[]) => {
      if (notes) {
        this.notes = [];
        for (let i = 0; i < notes.length; i++) {
          this.notes.push(notes[i]);
        }
      }
      this.display();
    })
  }

  //Uses the input notes array to generate the final display data
  generateNotesDisplayData(notes: INote[]) {
    if (notes) {
      this.notesBy1 = [];
      for (let i = 0; i < notes.length; i++) {
        if (this.archivesPage) {
          if (notes[i].archived) {
            this.notesBy1.push(notes[i]);
          }
        } else {
          if (this.searchForm.controls['showArchived'].value) {
            this.notesBy1.push(notes[i]);
          } else {
            if (!notes[i].archived) {
              this.notesBy1.push(notes[i]);
            }
          }
        }
      }
      this.notesBy2 = [[]];
      this.notesBy3 = [[]];
      this.notesBy4 = [[]];
      this.notesBy5 = [[]];
      for (let i = 0; i < this.notesBy1.length; i++) {
        if (((i + 1) % 2) == 0) {
          this.notesBy2[this.notesBy2.length - 1].push(this.notesBy1[i]);
          this.notesBy2.push([]);
        } else {
          this.notesBy2[this.notesBy2.length - 1].push(this.notesBy1[i]);
        }
        if (((i + 1) % 3) == 0) {
          this.notesBy3[this.notesBy3.length - 1].push(this.notesBy1[i]);
          this.notesBy3.push([]);
        } else {
          this.notesBy3[this.notesBy3.length - 1].push(this.notesBy1[i]);
        }
        if (((i + 1) % 4) == 0) {
          this.notesBy4[this.notesBy4.length - 1].push(this.notesBy1[i]);
          this.notesBy4.push([]);
        } else {
          this.notesBy4[this.notesBy4.length - 1].push(this.notesBy1[i]);
        }
        if (((i + 1) % 5) == 0) {
          this.notesBy5[this.notesBy5.length - 1].push(this.notesBy1[i]);
          this.notesBy5.push([]);
        } else {
          this.notesBy5[this.notesBy5.length - 1].push(this.notesBy1[i]);
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
      for (let i = 0; i < this.notesBy5.length; i++) {
        if (this.notesBy5[i].length == 0) {
          this.notesBy5.splice(i, 1);
        }
      }
    }
  }

  //Processes any search query and sends the results to generateProductDisplayData
  display() {
    let query: string = this.searchForm.controls['search'].value;
    if (!query) {
      query = '';
    }
    query = query.toLowerCase().trim();

    if (query.length > 0) {
      let queryWords: string[] = query.split(' ');
      let results: [INote[]] = [[]];
      for (let i = 0; i < queryWords.length; i++) {

        results.push(this.notes.filter((el: INote) => {
          let tagString = '';
          for (let i = 0; i < el.tags.length; i++) {
            tagString += el.tags[i] + ' ';
          }
          return (el.title.toLowerCase().indexOf(queryWords[i]) >= 0 || el.note.toLowerCase().indexOf(queryWords[i]) >= 0 || tagString.toLowerCase().indexOf(queryWords[i]) >= 0 || el.createdDate.toString().toLowerCase().indexOf(queryWords[i]) >= 0 || el.modifiedDate.toString().toLowerCase().indexOf(queryWords[i]) >= 0)
        }));
      }

      let resultsAll: INote[] = [];
      for (let i = 0; i < results.length; i++) {
        for (let y = 0; y < results[i].length; y++) {
          resultsAll.push(results[i][y]);
        }
      }

      let counts: any = {};
      for (let i = 0; i < resultsAll.length; i++) {
        counts[resultsAll[i].noteId] = 1 + (counts[resultsAll[i].noteId] || 0);
      }

      let countsArray = Object.keys(counts).map(function (key) {
        return { noteId: Number(key), count: counts[key] };
      });
      countsArray.sort((a, b) => {
        return b.count - a.count;
      })

      let finalResults: INote[] = [];
      countsArray.forEach((el) => {
        let p: INote | undefined = this.findNoteById(el.noteId);
        if (p) {
          finalResults.push(p);
        }
      })
      this.generateNotesDisplayData(finalResults);
    } else {
      this.generateNotesDisplayData(this.notes);
    }
  }

  findNoteById(noteId: number) {
    return this.notes.find((el: INote) => {
      return (el.noteId == noteId);
    })
  }

  clearSearch() {
    this.searchForm.reset();
    this.display();
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
      this.dialog.open(NoteDialogComponent, {
        maxWidth: '100vw',
        width: '100%',
        height: '100vh'
      });
    }
  }

}
