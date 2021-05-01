import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ERROR_DISPLAY_TIME_IN_MILLIS } from '../constants';

@Injectable()
export class ErrorHandler {
    constructor(private snackBarService: MatSnackBar) {
    }

    public display(error: any) {
        const messageToDisplay = this.extractMessage(error) 
        this.snackBarService.open(
            messageToDisplay,
            null,
            {
                duration: ERROR_DISPLAY_TIME_IN_MILLIS,
                panelClass: ['error-snackbar']
            }
        )
    }

    private extractMessage(error: any) {
        if (typeof error.error === 'string') {
            return error.error;
        } else if (typeof error.message === 'string') {
            return error.message;
        } else {
            return 'Unknown error';
        }
    }
}