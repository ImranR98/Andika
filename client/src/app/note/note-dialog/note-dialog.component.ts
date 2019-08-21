import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { INote, IUpdateNote } from 'src/app/models/notes.models';
import { MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent, MatDialog } from '@angular/material';
import { NotesService } from 'src/app/services/notes.service';
import { ErrorService } from 'src/app/services/error.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DeleteNoteDialogComponent } from '../delete-note-dialog/delete-note-dialog.component';

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.sass']
})
export class NoteDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<NoteDialogComponent>, private noteService: NotesService, private errorService: ErrorService, @Inject(MAT_DIALOG_DATA) public note: INote, private dialog: MatDialog) { }

  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  waiting: boolean = false;

  noteForm = new FormGroup({
    title: new FormControl('', Validators.required),
    note: new FormControl(''),
    tags: new FormControl('')
  });

  tags: string[] = [];

  ngOnInit() {
    this.noteForm.controls['title'].setValue(this.note.title);
    this.noteForm.controls['note'].setValue(this.note.note);
    for (let i = 0; i < this.note.tags.length; i++) {
      this.tags.push(this.note.tags[i]);
    }
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
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
          this.dialogRef.close();
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

  updateNote() {
    let updateNote: IUpdateNote = {
      id: this.note.id,
      title: this.noteForm.controls['title'].value,
      note: this.noteForm.controls['note'].value,
      tags: this.tags
    }
    this.waiting = true;
    this.noteService.updateNote(updateNote).then(() => {
      this.waiting = false;
      this.dialogRef.close();
    }).catch((err) => {
      this.errorService.showError(err);
      this.waiting = false;
    });
  }

  close() {
    this.dialogRef.close();
  }

}
