export interface IUser {
    email: string,
    firstName: string,
    lastName: string
}

export interface IRegisterUser {
    email: string,
    firstName: string,
    lastName: string,
    password: string
}

export interface ILoginUser {
    email: string,
    password: string
}