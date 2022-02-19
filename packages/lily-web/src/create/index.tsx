import { useEffect, useState } from "react";
import { BOOK_SERVICE, VUE, BookContextType } from "lily-types";
import { BodyContainer, MainContainer, NavigationContainer } from "lily-web/components";
import { BookServiceProvider, useBookContext, updatePage, updateNewBook } from 'lily-service';
import { newBookVueData } from './utils';

import Divider from "./Divider";
import BodyComponent from "./BodyComponent";
import { DeleteComponent } from "./ModalComponents";
import NavigationComponent from "./NavigationComponent";


const Main = () => {
    const context: BookContextType = useBookContext();
    const { notifications, vue, dispatcher } = context;
    const [notif, setNotif] = useState(null);
    
    useEffect(() => {
        dispatcher.setFrom({vue: newBookVueData});
    }, []);

    useEffect(() => {
        updateNewBook(context);
        updatePage(context);
    }, [notifications]);

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

