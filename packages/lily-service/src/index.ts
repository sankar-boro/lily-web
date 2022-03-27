import { vue } from 'lily-types';
export * from './providers/BookServiceProvider';
export * from './providers/HomeServiceProvider';
export * from './providers/AuthServiceProvider';
export * from './providers/FormServiceProvider';
export * from './providers/BlogServiceProvider';
export * from './BookService';

type ApiResponse = any;
type InitFormData = any;

export type FormData = ApiResponse | InitFormData;

export type SetModalData = {
    title: string,
    delete: any,
}

export interface Dispatcher {
    setModal: (data: SetModalData) => void,
    setKeyVal: (key: any, val: any) => void,
    setVue: (data: vue) => void,
    setFrom: (obj: any) => void,
}