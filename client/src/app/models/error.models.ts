export interface IAppError {
    message: string;
    actionable: boolean;
};

export class AppError implements IAppError {
    constructor(actionable: boolean = false, message: string = 'Unknown Error') { }
    message;
    actionable;
}