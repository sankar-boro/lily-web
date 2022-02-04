import { BookHandler } from "lily-service";
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
    SETTERSV1 = 'SETTERSV1',
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
export type Common = {
    bookId: string;
    body: string;
    identity: number;
    title: string;
    uniqueId: string;
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
}
export type ParentId = {
    parentId: string;
}
export type ParentNode = Common;
export type ChildNode = Common & ParentId;
export type SubSection = ChildNode;
export type SubSections = {
    child: SubSection[]
}
export type Section = Common & ParentId & SubSections;
export type Sections = {
    child: Section[],
}
export type Chapter = Common;
export type Page = Common & ParentId & Sections;
export type ApiData = (Common | Page)[];
export type RawData = (ParentNode | ChildNode)[];
export type ActivePage = Common | Page | Section;
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
    FETCHING: 'FETCHING',
    INIT: 'INIT',
    ERROR: 'ERROR',
    DOCUMENT: 'DOCUMENT'
}
export type BookContextType = {
    rawData: null | RawData,
    apiData: null | ApiData,
    bookId: null | string,
    parentId: null | string,
    formData: null | any,
    viewData: null | any,
    editData: null | any,
    activePage: null | Chapter | Page | Section,
    apiState: null,
    error: null | string,
    dispatch: (data: any) => void,
    vue: string,
    service: BookHandler,
    notifications: null,
}
export type BookActionType = {
    type: string,
    setters: any[],
    settersv1: {
        keys: [],
        values: [],
    }
}