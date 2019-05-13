export interface IUser {
    email: string,
    firstName: string,
    lastName: string
}

export interface IUserRegister {
    email: string,
    firstName: string,
    lastName: string,
    password: string
}

export interface IUserLogin {
    email: string,
    password: string
}