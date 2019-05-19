export interface INote {
    id: number;
    title: string;
    note: string;
    tags: string[];
    archived: boolean;
    createdDate: Date;
    modifiedDate: Date;
}

export interface IAddNote {
    email: string;
    title: string;
    note: string;
    tags: string[];
    archived: boolean;
}

export interface IUpdateNote {
    id: number;
    title: string;
    note: string;
    tags: string[];
}

export interface IDeleteNote {
    id: number;
}