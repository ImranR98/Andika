export interface IUser {
    userId: number,
    email: string,
    firstName: string,
    lastName: string,
    userType: string
}

export interface IRegisterUserFormInput {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    passwordConfirm: string
}

export interface ILoginUserFormInput {
    email: string,
    password: string
}

export interface IPasswordUpdateFormInput {
    password: string,
    newPassword: string,
    passwordConfirm: string;
}

export interface IAccountUpdateFormInput {
    firstName: string,
    lastName: string
}

export interface IResetPasswordFormInput {
    email: string,
    password: string,
    passwordConfirm: string
}