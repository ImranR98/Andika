export interface IAppError {
    message: string;
    actionable: boolean;
};

export class AppError implements IAppError {
    constructor(actionable: boolean = false, message: string = 'Unknown Error') {
        this.message = message
        this.actionable = actionable
    }
    message: string;
    actionable: boolean;
}