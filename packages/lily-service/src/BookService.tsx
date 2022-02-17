import { GET_BOOK_ALL, getQueryAuth } from "lily-query";
import { RawData, ApiData, ActivePage } from "lily-types";
import { sortAll } from './DataHandler';

interface BookService {
    readonly bookId: any;
    readonly apiData: null | RawData;
    readonly err: any;
    payload: any;
    rawData: any;
    activePage: any;

    fetch(bookId: string): any;
    map_res(): any;
    map_err(): any;
}

class BookHandler implements BookService {
    rawData: null | RawData = null;
    apiData: null | ApiData = null;
    activePage: null | ActivePage = null;
    bookId: null | string = null;
    err: any;
    payload: any;

    fetch(bookId: string): Promise<BookHandler> {
        this.bookId = bookId;
        const prefix = GET_BOOK_ALL;
        const url = `${prefix}${bookId}`;
        return new Promise(async (resolve, reject) => {
            const successCallBack = (successData: any) => {
                this.payload = successData;
                resolve(this);
            }
            const errorCallBack = (errorData: any) => {
                this.err = errorData;
                reject(this);
            }
            await getQueryAuth({url, successCallBack, errorCallBack});
        });
    }
    
    map_res(): BookHandler {
        const { payload } = this;
        const { status, data } = payload;
        if (status && data && status === 200) {
            this.rawData = data;
            if (data.length > 0) {
                this.apiData = sortAll(data);
                this.apiData.forEach((page: any) => {
                    if (page.uniqueId === this.bookId) {
                        this.activePage = page;
                    }
                });
            }
        }
        return this;
    }

    map_err(): BookHandler {
        const { err } = this;
        const { message } = err;
        if(message) {
            this.err = message;
        }
        return this;
    }
}

export type { BookService };
export { BookHandler } ;