import { useEffect, useState } from "react";
import { BOOK_SERVICE, VUE, BookContextType } from "lily-types";
import { BodyContainer, MainContainer, NavigationContainer } from "lily-web/components";
import { BookServiceProvider, useBookContext, updatePage, updateNewBook } from 'lily-service';
import { CREATE_NEW_BOOK } from "lily-query";

import Divider from "./Divider";
import BodyComponent from "./BodyComponent";
import { DeleteComponent } from "./ModalComponents";
import NavigationComponent from "./NavigationComponent";


const Main = () => {
    const context: BookContextType = useBookContext();
    const { dispatch, notifications, vue, bookId } = context;
    const [notif, setNotif] = useState(null);
    
    useEffect(() => {
        const formDataValue = {
            url: CREATE_NEW_BOOK,
            identity: 101,
            type: 'NEW_BOOK'
        }
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['formData', 'vue'],
                values: [formDataValue, VUE.FORM]
            }
        })
    }, []);

    useEffect(() => {
        updateNewBook(context);
        updatePage(context);
    }, [notifications]);

    // if (!bookId) return null;
    if (vue === VUE.INIT) return <>Initializing.</>
    if (vue === VUE.ERROR) return <>Api Error. {notif}</>
    if (vue === VUE.FETCHING) return <>Fetching Book.</>
    if (vue === VUE.NONE) return <>Book does not exist with id {bookId}</>;
    return <RenderComponent />
}

const RenderDeleteComponent = ({
    modal
}: any) => {
    if (modal && modal.type === 'DELETE') return <DeleteComponent />
    return null;
}

const RenderModal = () => {
    const { modal }: BookContextType = useBookContext();
    if (modal) {
        return <div className="modal">
            <div className="modal-container">
                <div className="modal-body">
                    <RenderDeleteComponent 
                        modal={modal}
                    />
                </div>
            </div>
        </div>
    }
    return null;
}

const RenderComponent = () => {
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

export default function CreateBookComponent(){
    return <BookServiceProvider>
        <Main />
    </BookServiceProvider>
}

