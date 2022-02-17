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
export type DefaultActionType = {
    type: string,
    setters?: {
        keys: any[],
        values: any[],
    }
}
export const DELETE = {
    PAGE: 'PAGE',
    SECTION: 'SECTION',
    SUB_SECTION: 'SUB_SECTION'
}