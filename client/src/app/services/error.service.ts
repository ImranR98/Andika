import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { IAppError, AppError } from '../models';

@Injectable({
  providedIn: 'root'
})

//This service handles showing messages (often errors) in a snackBar
export class ErrorService {

  constructor(private snackBar: MatSnackBar) { }

  showSimpleSnackBar(message: string) {
    this.snackBar.dismiss();
    this.snackBar.open(message, 'Okay');
  }

  standardizeError(error: any, actionable: boolean = false) {
    let standardError: IAppError = new AppError(actionable);

    //Since Backend Server routes all 404 requests to the Frontend, this will be seen as a 200 response with HTML body
      if (error.status == 200) {
        error.status = 404;
        error.statusText = 'Not Found'
      }

    if (typeof error == 'string') {
      standardError.message = error;
    } else if (error.error) {
      if (typeof error.error == 'string') {
        standardError.message = error.error;
      }
    } else if (error.statusText) {
      standardError.message = error.statusText;
    }
    return standardError;
  }

  showError(error: IAppError, callback: Function = null) {
    error = this.standardizeError(error);
    this.snackBar.dismiss();
    let actionText = 'Okay'
    if (error.actionable && callback) {
      actionText = 'Retry'
    }
    this.snackBar.open(error.message, actionText).onAction().subscribe(() => {
      if (error.actionable && callback) {
        callback();
      }
    });
  }

  clearError() {
    this.snackBar.dismiss();
  }

}
