import BodyRenderer from "./BodyRenderer";
import NavigationRenderer from "./NavigationRenderer";
import { BookServiceProvider, setActivePageFn, sortAll, useBookContext, updatePage, updateNewBook } from 'lily-service';
import { useEffect } from "react";
import { BOOK_SERVICE, VUE } from "lily-types";

const Body = () => {
    const context = useBookContext();
    const { dispatch, notifications, rawData, bookId, activePage, formData }: any = useBookContext();
    useEffect(() => {
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: [
                {
                    key: 'formData',
                    value: {
                        url: "http://localhost:8000/book/create/new/book",
                        identity: 101,
                        type: 'NEW_BOOK'
                    }
                }
            ]
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
