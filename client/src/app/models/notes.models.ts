export interface INote {
    noteId: number;
    title: string;
    note: string;
    tags: string[];
    archived: boolean;
    pinned: boolean;
    createdDate: Date;
    modifiedDate: Date;
    imageType: string;
    imageBase64: string;
}

export interface IAddNote {
    title: string;
    note: string;
    tags: string[];
    archived: boolean;
    pinned: boolean;
    imageType: string;
    imageBase64: string;
}

export interface IUpdateNote {
    noteId: number;
    title: string;
    note: string;
    tags: string[];
    imageType: string;
    imageBase64: string;
}

export interface IDeleteNote {
    noteId: number;
}