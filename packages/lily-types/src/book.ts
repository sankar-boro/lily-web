import { RawData, ApiData, Chapter, Page, Section } from 'lily-types'
import { DefaultActionType } from './index';
import { BookHandler } from "lily-service/BookService";

export type BookActionType = DefaultActionType;

export type BookContextType = {
    rawData: null | RawData,
    apiData: null | ApiData,
    bookId: null | string,
    formData: null | any,
    viewData: null | any,
    editData: null | any,
    activePage: null | Chapter | Page | Section,
    error: null | string,
    vue: string,
    service: BookHandler,
    notifications: null,
    dispatch: (data: any) => void,
    modal: any,
    activity: null | {
        type: string,
        data: any,
    }
}

export enum BOOK_SERVICE {
    API_STATE = 'API_STATE',
    API_DATA = 'API_DATA',
    SETTERS = 'SETTERS',
    FORM_PAGE_SETTER = 'FORM_PAGE_SETTER',
    ACTIVE_PAGE = 'ACTIVE_PAGE'
}

export const VUE = {
    FORM: 'FORM',
    NONE: 'NONE',
    UPDATING: 'UPDATING',
    FETCHING: 'FETCHING',
    INIT: 'INIT',
    ERROR: 'ERROR',
    DOCUMENT: 'DOCUMENT'
}