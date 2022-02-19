import { RawData, ApiData, Chapter, Page, Section } from 'lily-types'
import { DefaultActionType } from './index';
import { BookHandler } from "lily-service/BookService";

export type BookActionType = DefaultActionType;
type vue = {
    type: string,
    document: {
        type: string | null,
    },
    form: {
        type: string | null,
        method: string | null,
        data: any | null,
    },
}
export type BookContextType = {
    rawData: null | RawData,
    apiData: null | ApiData,
    bookId: null | string,
    formData: null | any,
    viewData: null | any,
    editData: null | any,
    activePage: null | Chapter | Page | Section,
    error: null | string,
    vue: vue,
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
    SETTERS = 'SETTERS',
}

export const FORM = {

}