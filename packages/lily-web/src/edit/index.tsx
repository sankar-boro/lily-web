import { useEffect, useState } from "react";
import BodyRenderer from "./BodyRenderer";
import NavigationRenderer from "./NavigationRenderer";
import { BookHandler, updatePage } from "lily-service";
import { useBookContext, BookServiceProvider } from 'lily-service';
import { BookContextType, BOOK_SERVICE, VUE } from "lily-types";

const Body = () => {
    const context: BookContextType = useBookContext();
    const [notif, setNotif] = useState(null);
    const { dispatch, notifications, vue, bookId }: BookContextType = context;

    useEffect(() => {
        if (bookId) {
            const service = new BookHandler();
            service.fetch(bookId)
            .then((res) => res.map_res())
            .then((res) => {
                const { rawData, apiData, activePage } = res;
                if (rawData && apiData && activePage) {
                    dispatch({
                        type: BOOK_SERVICE.SETTERSV1,
                        settersv1: {
                            keys: ['rawData', 'apiData', 'activePage', 'bookId', 'vue'],
                            values: [rawData, apiData, activePage, bookId, VUE.DOCUMENT]
                        }
                    })
                } else {
                    dispatch({
                        type: BOOK_SERVICE.SETTERSV1,
                        settersv1: {
                            keys: ['vue'],
                            values: [VUE.NONE]
                        }
                    })
                }
            })
            .catch((err) => {
                setNotif(err);
            });
        }
    }, [bookId]);

    useEffect(() => {
        updatePage(context);
    }, [notifications]);

    if (!bookId) return null;
    if (vue === VUE.INIT) return <>Initializing.</>
    if (vue === VUE.ERROR) return <>Api Error. {notif}</>
    if (vue === VUE.FETCHING) return <>Fetching Book.</>
    if (vue === VUE.NONE) return <>Book does not exist with id {bookId}</>;
    return <Renderer context={context} />;
}

const Renderer = (props: any) => {
    return <div className="flex">
        <NavigationRenderer context={props.context} />
        <BodyRenderer />
    </div>  
}

export default function Main(){
    return <BookServiceProvider>
        <Body />
    </BookServiceProvider>
}