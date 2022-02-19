import { useEffect, useState } from "react";
import BodyComponent from "./BodyComponent";
import NavigationComponent from "./NavigationComponent";
import { BookHandler } from "lily-service/BookService";
import { useBookContext, BookServiceProvider, FormServiceProvider, useHomeContext, updatePage } from "lily-service";
import { BOOK_SERVICE, HOME_SERVICE, VUE } from "lily-types";
import { BodyContainer, MainContainer, NavigationContainer } from "lily-web/components";
import Divider from "./Divider";

const RenderComponent = () => {
    return <MainContainer>
        <NavigationContainer>
            <NavigationComponent />
        </NavigationContainer>
        <BodyContainer>
            <BodyComponent />  
        </BodyContainer>
        <Divider />
    </MainContainer>
}

const useBookFetch = (bookId: string | null) => {
    const [data, setData] = useState<any>(null);
    useEffect(() => {
        if (!bookId) return;
        const service = new BookHandler();
        service.fetch(bookId)
        .then((res) => res.map_res())
        .then((res) => {
            const { rawData, apiData, activePage } = res;
            setData({
                rawData, apiData, activePage
            })
        })
    }, [bookId]);
    return [data];
}

const Main = () => {
    const context = useBookContext();
    const { dispatch, vue, bookId, notifications } = context;
    const [bookData] = useBookFetch(bookId);
    const { dispatch: homeDispatch } = useHomeContext();
    const [notif, setNotif] = useState(null);
    useEffect(() => {
        if (!bookData) return;
        const {rawData, apiData, activePage } = bookData;
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
    }, [bookData]);

    useEffect(() => {
        updatePage(context);
    }, [notifications]);

    if (vue.type === VUE.NONE) return null;
    if (!bookId || !context.activePage) return null;
    return <RenderComponent />;
}

export default function ReadComponent(){
    return <BookServiceProvider>
        <FormServiceProvider>
            <Main />
        </FormServiceProvider>
    </BookServiceProvider>
}