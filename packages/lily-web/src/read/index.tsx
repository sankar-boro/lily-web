import { useEffect, useState } from "react";
import BodyComponent from "./BodyComponent";
import NavigationRenderer from "./NavigationComponent";
import { BookHandler } from "lily-service/BookService";
import { useBookContext, BookServiceProvider, FormServiceProvider, useHomeContext, updatePage } from "lily-service";
import { BOOK_SERVICE, HOME_SERVICE, VUE } from "lily-types";
import { BodyContainer, MainContainer, NavigationContainer } from "lily-web/components";
import Divider from "./Divider";

const RenderComponent = () => {
    return <MainContainer>
        <NavigationContainer>
            <NavigationRenderer />
        </NavigationContainer>
        <BodyContainer>
            <BodyComponent />  
        </BodyContainer>
        <Divider />
    </MainContainer>
}

const Main = () => {
    const context = useBookContext();
    const { dispatch: homeDispatch } = useHomeContext();
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
                    type: BOOK_SERVICE.SETTERS,
                    setters: {
                        keys: ['rawData', 'apiData', 'activePage', 'bookId', 'vue'],
                        values: [rawData, apiData, activePage, bookId, VUE.DOCUMENT]
                    }
                })
                homeDispatch({
                    type: HOME_SERVICE.SETTERS,
                    setters: {
                        keys: ['title'],
                        values: [activePage?.title]
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
    return <RenderComponent />;
}

export default function ReadComponent(){
    return <BookServiceProvider>
        <FormServiceProvider>
            <Main />
        </FormServiceProvider>
    </BookServiceProvider>
}