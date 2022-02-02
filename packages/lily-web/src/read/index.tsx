import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import Body from "./Body";
import NavigationRenderer from "./NavigationRenderer";
import { BookHandler } from "lily-service";
import { useBookContext, BookServiceProvider, FormServiceProvider } from "lily-service";
import { BOOK_SERVICE } from "lily-types";

const Main = () => {
    const context = useBookContext();
    const { dispatch } = context;
    const history: any = useHistory();
    const { bookId } = history.location.state;

    useEffect(() => {
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
    }, []);

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