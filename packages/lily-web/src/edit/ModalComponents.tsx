import { useBookContext } from "lily-service"
import { BOOK_SERVICE, BookContextType } from "lily-types";
import { Delete } from "lily-utils";

export const DeleteComponent = () => {
    const context = useBookContext();
    const { modal, dispatch }: BookContextType = context;
    console.log(context);
    if (modal === null) return null;
    
    const __delete = async () => {
        if(!modal.data && !modal.data.nodeType && !modal.data.deleteId) {
            console.log('Delete SubSection failed');
            return;
        }
        await Delete({
            context,
            type: modal.data.nodeType,
            deleteProps: {
                deleteId: modal.data.deleteId,
            }
        })
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['modal', 'activity'],
                values: [null, null]
            }
        })
    }
    const __cancel = () => {
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['modal', 'activity'],
                values: [null, null]
            }
        })
    }

    return <div>
        <div>
            Are your sure you want to delete {modal.data.nodeType}?
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