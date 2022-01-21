import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import BodyRenderer from "./BodyRenderer";
import NavigationRenderer from "./NavigationRenderer";
import { useAuthContext } from "lily-service";
import { useBookContext, BookServiceProvider } from 'lily-service';

const Body = () => {
    const context = useBookContext();
    const authContext = useAuthContext();
    const history: any = useHistory();
    const { dispatch, apiState, viewState } = context;
    const { setRead } = authContext;
    const { bookId } = history.location.state;

    const initState = () => {
        dispatch({
            type: 'SETTER',
            _setter: 'bookId',
            payload: bookId,
        });
        setRead(true);
        if (apiState === "SUCCESS") {
            dispatch({
                type: 'ACTIVE_PAGE',
                pageId: bookId,
                sectionId: null,
            });
        }
    }

    useEffect(initState, [dispatch, setRead, bookId, apiState]);

    if(!context.activePage) return <div>Fetching...</div>;

    return <Renderer context={context} />;
}

const Renderer = (props: any) => {
    return <div className="flex">
        <NavigationRenderer context={props.context} />
        <BodyRenderer context={props.context} />
    </div>  
}

export default function Main(props: any){
    return <BookServiceProvider>
        <Body />
    </BookServiceProvider>
}