import { useEffect, useState } from "react";
import BodyRenderer from "./BodyRenderer";
import NavigationRenderer from "./NavigationRenderer";
import { BookContextType, BOOK_SERVICE, VUE } from "lily-types";
import { useBookContext, BookServiceProvider, updatePage } from 'lily-service';
import { BookHandler } from "lily-service/BookService";
import { DeleteComponent } from "./ModalComponents";

const Body = () => {
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
    if (vue === VUE.INIT) return <>Initializing.</>
    if (vue === VUE.ERROR) return <>Api Error. {notif}</>
    if (vue === VUE.FETCHING) return <>Fetching Book.</>
    if (vue === VUE.NONE) return <>Book does not exist with id {bookId}</>;
    return <Renderer context={context} />;
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

const Renderer = (props: any) => {

    return <div className="flex edit-component-container">
        <RenderModal />
        <NavigationRenderer context={props.context} />
        <BodyRenderer />
    </div>  
}

export default function Main(){
    return <BookServiceProvider>
        <Body />
    </BookServiceProvider>
}