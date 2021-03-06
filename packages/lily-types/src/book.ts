import { RawData, ApiData, Chapter, Page, Section } from 'lily-types'
import { DefaultActionType } from './index';
import { BookHandler } from "lily-service/BookService";
import { Dispatcher } from "lily-service";

export type BookActionType = DefaultActionType;
export type vue = {
    document?: any,
    form?: {
        formTitle: string,
        data: any | null,
        callback?: (res: any) => void,
        cancel?: () => void,
    },
    isForm: boolean,
    isDoc: boolean,
    isNull: boolean,
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
    dispatch: (res: any) => void,
    modal: any,
    dispatcher: null | Dispatcher
}

export enum BOOK_SERVICE {
    SETTERS = 'SETTERS',
}
