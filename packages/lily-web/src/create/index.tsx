import BodyRenderer from "./BodyRenderer";
import NavigationRenderer from "./NavigationComponent";
import { BookServiceProvider, useBookContext, updatePage, updateNewBook } from 'lily-service';
import { useEffect } from "react";
import { BOOK_SERVICE, VUE } from "lily-types";

const Body = () => {
    const context = useBookContext();
    const { dispatch, notifications }: any = useBookContext();
    useEffect(() => {
        const formDataValue = {
            url: "http://localhost:8000/book/create/new/book",
            identity: 101,
            type: 'NEW_BOOK'
        }
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['formData'],
                values: [formDataValue]
            }
        })
    }, []);

    useEffect(() => {
        updateNewBook(context);
        updatePage(context);
    }, [notifications]);

    return <>    
        <NavigationRenderer />
        <BodyRenderer />
    </>
}
export default function Main(){
    return <BookServiceProvider>
        <Body />
    </BookServiceProvider>
}
