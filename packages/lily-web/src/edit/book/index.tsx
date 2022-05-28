import { useEffect } from "react";
import { createNewBookForm } from 'lily-utils';
import { BookContextType, VUE } from "lily-types";
import { BookHandler } from "lily-service/BookService";
import { useBookContext, BookServiceProvider, useAuthContext } from 'lily-service';

import Divider from "./Divider";
import BodyComponent from "./BodyComponent";
import { DeleteComponent } from "./ModalComponents";
import NavigationComponent from "./NavigationComponent";
import { BodyContainer, MainContainer, NavigationContainer } from "lily-web/components";

const RenderModal = () => {
    const { modal }: BookContextType = useBookContext();
    if (modal) {
        return <div className="modal">
            <div className="modal-container">
                <div className="modal-body">
                    <DeleteComponent />
                </div>
            </div>
        </div>
    }
    return null;
}

export const RenderComponent = () => {
    return <MainContainer>
        <NavigationContainer>
            <NavigationComponent />
        </NavigationContainer>
        <BodyContainer>
            <RenderModal />
            <BodyComponent />  
        </BodyContainer>
        <Divider />
    </MainContainer>  
}

const getBookData = (bookId: string | null, context: any) => {
    const { dispatch } = context;
    if (bookId) {
        const service = new BookHandler();
        service.fetch(bookId)
        .then((res) => res.map_res())
        .then((res) => {
            const { rawData, apiData, activePage } = res;
            if (rawData && apiData && activePage) {
                dispatch({
                    keys: ['rawData', 'apiData', 'activePage', 'bookId', 'vue'],
                    values: [rawData, apiData, activePage, bookId, VUE.DOCUMENT]
                })
            } else {
                dispatch({
                    keys: ['vue'],
                    values: [VUE.NONE]
                })
            }
        })
    }

    if (!bookId) {
        createNewBookForm(context);
    }
}

const Main = () => {
    const context: BookContextType = useBookContext();
    const { bookId }: BookContextType = context;
    useEffect(() => {getBookData(bookId, context)}, [bookId]);
    return <RenderComponent />;
}

export default function EditComponent(){
    const { authUserData } = useAuthContext();
    if (!authUserData) return "You need to be the owner";
    
    return <BookServiceProvider>
        <Main />
    </BookServiceProvider>
}