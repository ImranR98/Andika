import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-note-dialog',
  templateUrl: './delete-note-dialog.component.html',
  styleUrls: ['./delete-note-dialog.component.sass']
})
export class DeleteNoteDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DeleteNoteDialogComponent>) { }

  ngOnInit() { }

  action() {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close();
  }

}
