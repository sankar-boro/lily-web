import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import BodyRenderer from "./BodyRenderer";
import NavigationRenderer from "./NavigationRenderer";
import { BookHandler } from "lily-service";
import { useBookContext, BookServiceProvider } from 'lily-service';
import { BOOK_SERVICE } from "lily-types";

const Body = () => {
    const context = useBookContext();
    const { dispatch, bookId } = context;
    const history: any = useHistory();
    
    useEffect(() => {
        if (!bookId) return;
        const service = new BookHandler();
        service.fetch(bookId)
        .then((res) => res.map_res())
        .then((res) => {
            const { rawData, apiData, activePage } = res;
            dispatch({
                type: BOOK_SERVICE.SETTERS,
                setters: [
                    {
                        key: 'rawData',
                        value: rawData
                    },
                    {
                        key: 'apiData',
                        value: apiData
                    },
                    {
                        key: 'activePage',
                        value: activePage,
                    },
                    {
                        key: 'bookId',
                        value: bookId
                    }
                ]
            })
        });
    }, [bookId]);

    return <Renderer context={context} />;
}

const Renderer = (props: any) => {
    return <div className="flex">
        <NavigationRenderer context={props.context} />
        <BodyRenderer />
    </div>  
}

export default function Main(props: any){
    return <BookServiceProvider>
        <Body />
    </BookServiceProvider>
}