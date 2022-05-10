import { RawData, ApiData, Chapter, Page, Section } from 'lily-types'
import { DefaultActionType } from './index';
// import { vue } from "./index";

export type BlogActionType = DefaultActionType;
export type BlogContextType = {
    rawData: null | RawData,
    apiData: null | ApiData,
    blogId: null | string,
    formData: null | any,
    viewData: null | any,
    editData: null | any,
    activePage: null | Chapter | Page | Section,
    error: null | string,
    vue: any,
    notifications: null,
    dispatch: (res: any) => void,
    modal: any
}

export enum BLOG_SERVICE {
    SETTERS = 'SETTERS',
}
