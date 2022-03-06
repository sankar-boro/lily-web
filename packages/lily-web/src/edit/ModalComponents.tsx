import { useBookContext } from "lily-service"
import { BOOK_SERVICE, BookContextType } from "lily-types";
import { Delete } from "lily-utils";

export const DeleteComponent = () => {
    const context = useBookContext();
    const { modal, dispatch }: BookContextType = context;
    if (modal === null) return null;
    
    const __delete = async () => {
        if(!modal.event && !modal.event.nodeType && !modal.event.deleteId) {
            console.log('Delete SubSection failed');
            return;
        }
        await Delete({
            context,
            event: modal.event
        })
    }
    const __cancel = () => {
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['modal'],
                values: [null]
            }
        })
    }

    return <div>
        <div>
            Are your sure you want to delete {modal.event.nodeType}?
        </div>
        <div className="margin-top-50"/>
        <div>
            <button onClick={() => {
                __delete()
            }} className="button button-delete margin-right-10">
                Delete
            </button>
            <button onClick={() => {
                __cancel()
            }} className="button button-cancel">
                Cancel
            </button>
        </div>
    </div>
}