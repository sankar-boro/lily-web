import { GET_BOOK_ALL, GET_BLOG_ALL, getQueryAuth } from "lily-query";

export const getBlogs = (dispatch: any) => {
    getQueryAuth({ url: GET_BLOG_ALL})
    .then((res: any) => {
        if (
            res.status &&
            typeof res.status === "number" &&
            res.status === 200
        ) {
            dispatch({
                keys: ['blogs'],
                values: [res.data]
            })
        }
    })
    .catch((err) => {
    });
}

export const getBooks = (dispatch: any) => {
    getQueryAuth({ url: GET_BOOK_ALL})
    .then((res: any) => {
        if (
            res.status &&
            typeof res.status === "number" &&
            res.status === 200
        ) {
            dispatch({
                keys: ['books'],
                values: [res.data]
            })
        }
    })
    .catch((err) => {
    });
}