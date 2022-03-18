import { useEffect, useState } from "react";
import BodyComponent from "./BodyComponent";
import NavigationComponent from "./NavigationComponent";
import { BookHandler } from "lily-service/BookService";
import { useBookContext, BookServiceProvider, FormServiceProvider, useHomeContext, useAuthContext } from "lily-service";
import {  updatePage } from "lily-utils";
import { AUTH_SERVICE, BookContextType, BOOK_SERVICE, HOME_SERVICE, VUE } from "lily-types";
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
    const [err, setErr] = useState(false);
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
        .catch((err: any) => {
            setErr(true);
            console.log(JSON.parse(JSON.stringify(err)))
        })
    }, [bookId]);
    return [data, err];
}

const Main = () => {
    const context: BookContextType = useBookContext();
    const { vue, bookId, notifications, dispatcher } = context;
    const [bookData, err] = useBookFetch(bookId);
    const { dispatch: homeDispatch } = useHomeContext();
    const { dispatch: authDispatch } = useAuthContext();
    useEffect(() => {
        console.log(err)
        if (err) {
            console.log('authErr')
            authDispatch({
                keys: ['auth', 'authUserData'],
                values: ['false', null]
            })
        }
        if (!bookData) return;
        dispatcher?.setFrom(bookData);
        dispatcher?.setFrom({
            bookId,
            vue: VUE.DOCUMENT
        })
        homeDispatch({
            keys: ['title'],
            values: [bookData?.activePage?.title]
        })
    }, [bookData, err]);

    useEffect(() => {
        updatePage(context);
    }, [notifications]);

    if (vue.viewType === VUE.NONE) return null;
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