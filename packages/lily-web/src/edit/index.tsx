import { useEffect, useState } from "react";
import BodyComponent from "./BodyComponent";
import NavigationComponent from "./NavigationComponent";
import { BookContextType, BOOK_SERVICE, VUE } from "lily-types";
import { useBookContext, BookServiceProvider, updatePage } from 'lily-service';
import { BookHandler } from "lily-service/BookService";
import { DeleteComponent } from "./ModalComponents";
import { BodyContainer, MainContainer, NavigationContainer } from "lily-web/components";
import Divider from "./Divider";

const Main = () => {
    const context: BookContextType = useBookContext();
    const [notif, setNotif] = useState(null);
    const { dispatch, notifications, vue, bookId }: BookContextType = context;

    useEffect(() => {
        if (bookId) {
            const service = new BookHandler();
            service.fetch(bookId)
            .then((res) => res.map_res())
            .then((res) => {
                const { rawData, apiData, activePage } = res;
                if (rawData && apiData && activePage) {
                    dispatch({
                        type: BOOK_SERVICE.SETTERS,
                        setters: {
                            keys: ['rawData', 'apiData', 'activePage', 'bookId', 'vue'],
                            values: [rawData, apiData, activePage, bookId, VUE.DOCUMENT]
                        }
                    })
                } else {
                    dispatch({
                        type: BOOK_SERVICE.SETTERS,
                        setters: {
                            keys: ['vue'],
                            values: [VUE.NONE]
                        }
                    })
                }
            })
            .catch((err) => {
                setNotif(err);
            });
        }
    }, [bookId]);

    useEffect(() => {
        updatePage(context);
    }, [notifications]);

    if (!bookId) return null;
    // if (vue === VUE.INIT) return <>Initializing.</>
    if (vue === VUE.ERROR) return <>Api Error. {notif}</>
    if (vue === VUE.OTHERS) return <>Fetching Book.</>
    if (vue === VUE.NONE) return <>Book does not exist with id {bookId}</>;
    return <RenderComponent />;
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

export default function EditComponent(){
    return <BookServiceProvider>
        <Main />
    </BookServiceProvider>
}