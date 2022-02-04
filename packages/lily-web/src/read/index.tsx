import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import Body from "./Body";
import NavigationRenderer from "./NavigationRenderer";
import { BookHandler } from "lily-service";
import { useBookContext, BookServiceProvider, FormServiceProvider } from "lily-service";
import { BOOK_SERVICE, VUE } from "lily-types";

const Main = () => {
    const context = useBookContext();
    const { dispatch, vue } = context;
    const history: any = useHistory();
    const { state, pathname } = history.location;
    const [bookId, setBookId] = useState(null);

    useEffect(() => {
        if (!state && pathname) {
            const splitPathName = pathname.split('/');
            if (splitPathName.length === 3) {
                setBookId(splitPathName[2]);
            }
        }
        if (state && state.bookId) {
            setBookId(state.bookId);
        }
    }, [pathname]);

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
                        keys: ['rawData', 'apiData', 'activePage', 'bookId'],
                        values: [rawData, apiData, activePage, bookId]
                    }
                })
            });
        }
    }, [bookId]);

    if (!bookId) return null;
    if (vue === VUE.NONE) return null;
    if (vue === VUE.ERROR) return <>Something went wrong.</>
    if(!context.activePage) return <div>Fetching...</div>;
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