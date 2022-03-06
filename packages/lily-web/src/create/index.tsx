import { useEffect } from "react";
import { RenderComponent } from "../edit/index";
import { VUE, BookContextType } from "lily-types";
import { BookServiceProvider, useBookContext, createNewBookForm } from 'lily-service';

const Main = () => {
    const context: BookContextType = useBookContext();
    const { vue, bookId } = context;

    useEffect(() => {
        if (!bookId) {
            createNewBookForm(context);
        }
    }, []);

    if (vue.viewType === VUE.NONE) return null;
    
    return <RenderComponent />
}


export default function CreateBookComponent(){
    return <BookServiceProvider>
        <Main />
    </BookServiceProvider>
}

