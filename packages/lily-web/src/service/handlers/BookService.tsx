import axios from "axios";
import { sortAll } from "../../globals/forms/index";
import { Request } from "../../globals/types/index";

interface BookService {
    readonly state: string;
    readonly data: any[];
    readonly err: any;
    payload: any;

    fetch(bookId: string): any;
    map_res(): any;
    map_err(): any;
}

const getAllBookData = async (url: string) => {
    return await axios.get(url, {
        withCredentials: true,
    });
}

class BookHandler implements BookService {
    state = Request.INIT;
    data: any;
    err: any;
    payload: any;

    fetch(bookId: string): Promise<any> {
        this.state = Request.FETCH;
        const prefix = "http://localhost:8000/book/getall/";
        const url = `${prefix}${bookId}`;
        return new Promise(async (resolve, reject) => {
            getAllBookData(url)
            .then((res) => {
                this.state = Request.SUCCESS;
                this.payload = res;
                resolve(this);
            })
            .catch((err) => {
                this.state = Request.ERROR;
                this.err = err;
                reject(this);
            });
        });
    }
    
    map_res(): any {
        const { payload } = this;
        const { status, data } = payload;
        if (status && data && status === 200) {
            this.data = sortAll(data);
        }
        return this;
    }

    map_err(): any {
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