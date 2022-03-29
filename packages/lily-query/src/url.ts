const http = 'http://localhost:7500';

export const GET_BOOK_ALL = `${http}/books`;
export const CREATE_NEW_BOOK = `${http}/book/create`;
export const UPDATE_BOOK = `${http}/book/update`;
export const DELETE_BOOK = (deleteId: string) => `${http}/book/delete/${deleteId}`;

export const DELETE_BOOK_NODE = `${http}/booknode/delete`;
export const DELETE_AND_UPDATE_BOOK_NODE = `${http}/booknode/delete/update`;
export const MERGE_BOOK_NODE = `${http}/booknode/merge`;
export const APPEND_BOOK_NODE = `${http}/booknode/create`;
export const UPDATE_BOOK_NODE = `${http}/booknode/update`;

export const GET_BOOK_FROM_ID = (bookId: string) => `${http}/book/get/${bookId}`;
export const LOGOUT = `${http}/logout`;
export const LOGIN = `${http}/login`;
export const SIGNUP = `${http}/signup`;
export const USER_SESSION = `${http}/user/session`;
export default null;


export const GET_BLOG_ALL = `${http}/blogs`;
export const CREATE_NEW_BLOG = `${http}/blog/create`;
export const UPDATE_BLOG = `${http}/blog/update`;
export const DELETE_BLOG = (deleteId: string) => `${http}/blog/delete/${deleteId}`;

export const GET_BLOG_FROM_ID = (bookId: string) => `${http}/blog/get/${bookId}`;
export const DELETE_BLOG_NODE = `${http}/blognode/delete`;
export const DELETE_AND_UPDATE_BLOG_NODE = `${http}/blognode/delete/update`;
export const MERGE_BLOG_NODE = `${http}/blognode/merge`;
export const APPEND_BLOG_NODE = `${http}/blognode/create`;
export const UPDATE_BLOG_NODE = `${http}/blognode/update`;