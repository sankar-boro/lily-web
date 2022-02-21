import { useEffect, useState } from "react";
import { BOOK_SERVICE, VUE, BookContextType } from "lily-types";
import { BodyContainer, MainContainer, NavigationContainer } from "lily-web/components";
import { BookServiceProvider, useBookContext, updatePage, updateNewBook } from 'lily-service';
import { createNewBookForm } from './utils';

import Divider from "./Divider";
import BodyComponent from "./BodyComponent";
import { DeleteComponent } from "./ModalComponents";
import NavigationComponent from "./NavigationComponent";


const Main = () => {
    const context: BookContextType = useBookContext();
    const { vue } = context;

    useEffect(() => {
        createNewBookForm(context);
    }, []);

    if (vue.viewType === VUE.NONE) return null;
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

