import { Option } from "ts-results";

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
