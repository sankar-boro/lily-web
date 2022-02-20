import { BookContextType, BOOK_SERVICE } from "./book";

export * from "./book";
export * from "./form";
export * from "./auth";
export * from "./home";

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
export const textareaRows = 10;
export const textareaCols = 50;
export type DefaultActionType = {
    type: string,
    setters?: {
        keys: any[],
        values: any[],
    }
}
export enum NODE_TYPE {
    FRONT_COVER = "FRONT_COVER",
    BACK_COVER = "BACK_COVER",
    PAGE = "PAGE",
    CHAPTER = "CHAPTER",
    SECTION = "SECTION",
    SUB_SECTION = "SUB_SECTION",
}
export enum HTTP_METHODS {
    CREATE = 'CREATE',
    DELETE = 'DELETE',
    UPDATE = 'UPDATE',
    PUT    = 'PUT'
}
export enum VUE {
    FORM = 'FORM',
    DOCUMENT = 'DOCUMENT',
    NONE = 'NONE',
    MODAL = 'MODAL'
}

export const getFormType = (num: number) => {
    switch (num) {
        case 101:
            return NODE_TYPE.FRONT_COVER;
        case 104:
            return NODE_TYPE.PAGE;
        case 105:
            return NODE_TYPE.SECTION;
        case 106:
            return NODE_TYPE.SUB_SECTION;
        default:
            return "NONE";
    }
}

export const vueSetter = (context: BookContextType) => {
    const { dispatch } = context;
    let vue: any = {
        type: null,
        document: {
            type: null,
        },
        form: {
            type: null,
            method: null,
            data: null,
        },
    }

    const __dispatch = (keys: any, values: any) => {
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys,
                values
            }
        })
    }
    return {
        document: (documentType: NODE_TYPE) => {
            vue.viewType = VUE.DOCUMENT;
            vue.document.type = documentType;
            __dispatch(['vue'], [vue]);
        }, 
        form: (formMethod: HTTP_METHODS, formData: any) => {
            vue.viewType = VUE.FORM;
            vue.form.type = getFormType(formData.identity);
            vue.form.method = formMethod;
            vue.form.data = formData;
            console.log(vue);
            __dispatch(['vue'], [vue]);
        }
    }
}
