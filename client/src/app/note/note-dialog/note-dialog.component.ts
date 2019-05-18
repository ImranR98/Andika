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

  loading: boolean = false;
  wait: boolean = false;

  ngOnInit() { }

  close() {
    this.dialogRef.close();
  }

}
