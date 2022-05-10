import { GET_BLOG_FROM_ID, getQueryAuth } from "lily-query";
import { RawData } from "lily-types";
import { sortBlog } from 'lily-utils';

interface BlogService {
    readonly blogId: any;
    readonly apiData: null | any[];
    readonly err: any;
    payload: any;
    rawData: any;

    fetch(blogId: string): any;
    map_res(): any;
    map_err(): any;
}

class BlogHandler implements BlogService {
    rawData: null | RawData = null;
    apiData: null | any[] = null;
    blogId: null | string = null;
    err: any;
    payload: any;

    fetch = (blogId: string): Promise<BlogHandler> => {
        this.blogId = blogId;
        return new Promise(async (resolve, reject) => {
            await getQueryAuth({ url: GET_BLOG_FROM_ID(blogId) })
            .then((res) => {
                console.log(res);
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
                this.apiData = sortBlog(data);
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