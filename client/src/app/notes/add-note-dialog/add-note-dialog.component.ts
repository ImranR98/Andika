import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatChipInputEvent } from '@angular/material';
import { NotesService } from 'src/app/services/notes.service';
import { ErrorService } from 'src/app/services/error.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { IAddNote } from 'src/app/models/notes.models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-note-dialog',
  templateUrl: './add-note-dialog.component.html',
  styleUrls: ['./add-note-dialog.component.sass']
})
export class AddNoteDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddNoteDialogComponent>, private noteService: NotesService, private errorService: ErrorService, private userService: UserService) { }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  note: IAddNote;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  waiting: boolean = false;

  noteForm = new FormGroup({
    title: new FormControl('', Validators.required),
    note: new FormControl(''),
    tags: new FormControl('')
  });

  tags: string[] = [];

  ngOnInit() { }

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

  addNote() {
    let addNote: IAddNote = {
      email: this.userService.getUser().email,
      title: this.noteForm.controls['title'].value,
      note: this.noteForm.controls['note'].value,
      tags: this.tags,
      archived: false
    }
    this.waiting = true;
    this.noteService.addNote(addNote).then(() => {
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
