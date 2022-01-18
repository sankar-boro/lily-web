import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import Body from "./Body";
import NavigationRenderer from "./NavigationRenderer";
import { useAuthContext } from "../../service/AuthServiceProvider";
import BookServiceProvider, { useBookContext} from "../../service/BookServiceProvider";
import FormServiceProvider from "../../service/FormServiceProvider";

const Main = () => {
    const context = useBookContext();
    const { dispatch, apiState } = context;
    const authContext = useAuthContext();
    const { setRead } = authContext;
    const history: any = useHistory();
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
    useEffect(initState, [dispatch, bookId, apiState]);
    if(!context.apiData) return <div>Fetching...</div>;
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