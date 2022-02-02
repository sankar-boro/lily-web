import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import BodyRenderer from "./BodyRenderer";
import NavigationRenderer from "./NavigationRenderer";
import { BookHandler, updatePage } from "lily-service";
import { useBookContext, BookServiceProvider } from 'lily-service';
import { BOOK_SERVICE } from "lily-types";

const Body = () => {
    const context = useBookContext();
    const { dispatch, notifications }: any = context;
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

    useEffect(() => {
        updatePage(context);
    }, [notifications]);

    if(!context.activePage) return <div>Fetching...</div>;

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