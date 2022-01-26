import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import BodyRenderer from "./BodyRenderer";
import NavigationRenderer from "./NavigationRenderer";
import { BookHandler, useAuthContext } from "lily-service";
import { useBookContext, BookServiceProvider } from 'lily-service';
import { BOOK_SERVICE } from "lily-types";

const Body = () => {
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
    }, []);

    if(!context.activePage) return <div>Fetching...</div>;

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