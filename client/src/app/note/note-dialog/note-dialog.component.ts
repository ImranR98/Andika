import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { INote } from 'src/app/models/notes.models';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotesService } from 'src/app/services/notes.service';
import { ErrorService } from 'src/app/services/error.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.sass']
})
export class NoteDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<NoteDialogComponent>, private noteService: NotesService, private errorService: ErrorService, @Inject(MAT_DIALOG_DATA) public note: INote) { }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  noteForm = new FormGroup({
    title: new FormControl('', Validators.required),
    note: new FormControl('')
  });

  waiting: boolean = false;

  ngOnInit() {
    this.noteForm.controls['title'].setValue(this.note.title);
    this.noteForm.controls['note'].setValue(this.note.note);
  }

  deleteNote() {
    this.waiting = true;
    this.noteService.deleteNote(this.note.id).then(() => {
      this.waiting = false;
      this.dialogRef.close();
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

  updateNote() {
    let tempNote: INote = this.note;
    tempNote.title = this.noteForm.controls['title'].value;
    tempNote.note = this.noteForm.controls['note'].value;
    this.waiting = true;
    this.noteService.updateNote(tempNote).then(() => {
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
