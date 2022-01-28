import { Option } from "ts-results";

export type FormData = {
    topUniqueId: string;
    botUniqueId: string;
    identity: number;
};

export enum FORM_TYPE {
    FRONT_COVER = "FRONT_COVER",
    BACK_COVER = "BACK_COVER",
    PAGE = "PAGE",
    CHAPTER = "CHAPTER",
    SECTION = "SECTION",
    SUB_SECTION = "SUB_SECTION",
    CREATE_UPDATE = "CREATE_UPDATE",
    NONE = "NONE",
    UPDATE = "UPDATE",
}

export enum ID_TYPES {
    BOOK = "BOOK",
    ACTIVE = "ACTIVE",
    SECTION = "SECTION",
    EDIT_SUB_SECTION = "EDIT_SUB_SECTION",
    PARENT = "PARENT",
    FORM = "FORM"
}

export type Form = {
    formType: FORM_TYPE;
    formData: Option<FormData>;
};

export enum BOOK_SERVICE {
    API_STATE = 'API_STATE',
    API_DATA = 'API_DATA',
    SETTER = 'SETTER',
    SETTERS = 'SETTERS',
    FORM_PAGE_SETTER = 'FORM_PAGE_SETTER',
    ACTIVE_PAGE = 'ACTIVE_PAGE'
}

export const constants = {
    IDLE: 100,
    RESULT: 200,
    WAITING: 300,
    LOCKED: 409,
    heights: {
        fromTopNav: {
            leftBar: 35,
            rightBar: 35,
            topBar: 45,

        }
    }
}

export const URLS = {
    UPDATE_OR_DELETE: "http://localhost:8000/book/update_or_delete",
}

export const ENV = {
    LOG: true,
}

export type Node = {
    bookId: string;
    body: string;
    identity: number;
    title: string;
    parentId: string;
    uniqueId: string;
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
};
export type Section = {
    bookId: string;
    body: string;
    child: Node[],
    identity: number;
    title: string;
    uniqueId: string;
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
}
export type Chapter = {
    bookId: string;
    body: string;
    child: Section[],
    identity: number;
    title: string;
    uniqueId: string;
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
}
export type ApiData = Chapter[];
export type ChapterParentNode = Chapter;
export type ChapterChildNode = Chapter;
export type ParentChildNode = {
    parentNode: Option<Chapter>,
    childNode: Option<Chapter>,
}
export enum Request {
    INIT = 'INIT',
    FETCH = 'FETCH',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR'
}

export const textareaRows = 10;
export const textareaCols = 50;
export const VUE = {
    FORM: 'FORM',
    NONE: 'NONE',
    UPDATING: 'UPDATING',
    INIT: 'INIT',
    ERROR: 'ERROR',
    DOCUMENT: 'DOCUMENT'
}