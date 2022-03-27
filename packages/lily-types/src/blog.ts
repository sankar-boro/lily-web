import { RawData, ApiData, Chapter, Page, Section } from 'lily-types'
import { DefaultActionType } from './index';
import { BlogHandler } from "lily-service/BlogService";
import { Dispatcher } from "lily-service";
import { vue } from "./index";

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
    vue: vue,
    service: BlogHandler,
    notifications: null,
    dispatch: (res: any) => void,
    modal: any,
    dispatcher: null | Dispatcher
}

export enum BLOG_SERVICE {
    SETTERS = 'SETTERS',
}
