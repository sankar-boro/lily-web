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
    const { dispatch, notifications, vue, bookId, dispatcher } = context;
    const [notif, setNotif] = useState(null);
    
    useEffect(() => {
        const __vue = {
            type: 'FORM',
            document: {},
            form: {
                type: 'NEW_BOOK',
                method: 'CREATE',
                url: CREATE_NEW_BOOK,
                data: {
                    identity: 101
                } 
            }
        }
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['vue'],
                values: [__vue]
            }
        })
    }, []);

    useEffect(() => {
        updateNewBook(context);
        updatePage(context);
    }, [notifications]);

    console.log(vue)
    if (vue.type === VUE.NONE) return null;
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

