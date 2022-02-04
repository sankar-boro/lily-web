import { useEffect, useState } from "react";
import Body from "./Body";
import NavigationRenderer from "./NavigationRenderer";
import { BookHandler, updatePage } from "lily-service";
import { useBookContext, BookServiceProvider, FormServiceProvider } from "lily-service";
import { BOOK_SERVICE, VUE } from "lily-types";

const Main = () => {
    const context = useBookContext();
    const { activePage } = context;
    const [notif, setNotif] = useState(null);

    const { dispatch, vue, bookId, notifications } = context;

    useEffect(() => {
        if (bookId) {
            const service = new BookHandler();
            service.fetch(bookId)
            .then((res) => res.map_res())
            .then((res) => {
                const { rawData, apiData, activePage } = res;
                dispatch({
                    type: BOOK_SERVICE.SETTERSV1,
                    settersv1: {
                        keys: ['rawData', 'apiData', 'activePage', 'bookId', 'vue'],
                        values: [rawData, apiData, activePage, bookId, VUE.DOCUMENT]
                    }
                })
            })
            .catch((err) => {
                setNotif(err);
            });
        }
    }, [bookId]);

    useEffect(() => {
        updatePage(context);
    }, [notifications]);

    if (vue === VUE.INIT) return <>Initializing.</>
    if (vue === VUE.ERROR) return <>Api Error. {notif}</>
    if (vue === VUE.FETCHING) return <>Fetching Book.</>
    if (vue === VUE.NONE) return <>Book does not exist with id {bookId}</>;
    if (!bookId || !activePage) return null;
    return <Renderer />;
}

const Renderer = () => {
    return <div className="flex">
        <NavigationRenderer />
        <Body />
    </div>  
}

export default function MainContext(){
    return <BookServiceProvider>
        <FormServiceProvider>
            <Main />
        </FormServiceProvider>
    </BookServiceProvider>
}