import { GET_BOOK_FROM_ID, getQueryAuth } from "lily-query";
import { RawData, ApiData, ActivePage } from "lily-types";
import { sortAll } from 'lily-utils';

interface BlogService {
    readonly blogId: any;
    readonly apiData: null | RawData;
    readonly err: any;
    payload: any;
    rawData: any;
    activePage: any;

    fetch(blogId: string): any;
    map_res(): any;
    map_err(): any;
}

class BlogHandler implements BlogService {
    rawData: null | RawData = null;
    apiData: null | ApiData = null;
    activePage: null | ActivePage = null;
    blogId: null | string = null;
    err: any;
    payload: any;

    fetch = (blogId: string): Promise<BlogHandler> => {
        this.blogId = blogId;
        return new Promise(async (resolve, reject) => {
            await getQueryAuth({ url: GET_BOOK_FROM_ID(blogId) })
            .then((res) => {
                this.payload = res;
                resolve(this);
            })
            .catch((err) => {
                this.err = err;
                reject(this.err);
            });
        });
    }
    
    map_res(): BlogHandler {
        const { payload } = this;
        const { status, data } = payload;
        if (status && data && status === 200) {
            this.rawData = data;
            if (data.length > 0) {
                this.apiData = sortAll(data);
                this.apiData.forEach((page: any) => {
                    if (page.uniqueId === this.blogId) {
                        this.activePage = page;
                    }
                });
            }
        }
        return this;
    }

    map_err(): BlogHandler {
        const { err } = this;
        const { message } = err;
        if(message) {
            this.err = message;
        }
        return this;
    }
}

export type { BlogService };
export { BlogHandler } ;