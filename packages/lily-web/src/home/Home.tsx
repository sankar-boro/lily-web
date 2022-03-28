import { useEffect } from "react";
import Card from "./Card";
import BlogCard from "./BlogCard";
import { useHomeContext, useAuthContext } from "lily-service";
import { GET_BOOK_ALL, GET_BLOG_ALL, getQueryAuth } from "lily-query";

const Home = () => {
    const { books, blogs, dispatch } = useHomeContext();
    const { dispatch: authDispatch } = useAuthContext();
    useEffect(() => { 
        if (!localStorage.getItem('auth')) {
            authDispatch({
                keys: ['auth', 'authUserData'],
                values: ['false', null]
            })
        }   
        dispatch({
            keys: ['title'],
            values: [null]
        })
    }, []);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
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
    }, []);

    if (books.length === 0 && blogs.length === 0) {
        return <div className="container-sm flex">
            Nothing to show.
        </div>
    }
    
    return (
        <div className="container-sm flex">
            {books
                .map((book: any) => {
                    return <Card book={book} key={book.bookId} />;
                })}

            {blogs
                .map((blog: any) => {
                    return <BlogCard blog={blog} key={blog.bookId} />;
                })}
        </div>
    );
};

export default Home;
