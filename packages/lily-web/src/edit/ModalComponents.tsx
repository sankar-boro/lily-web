import { useBookContext } from "lily-service"
import { BookContextType, BOOK_SERVICE } from "lily-types";
import { Delete } from "lily-components";

type Activity = {
    type: string;
    data: any;
}

export const DeleteComponent = () => {
    const context = useBookContext();
    const { activity, modal, dispatch }: BookContextType = context;
    if (activity === null || modal === null) return null;
    
    const act = activity as Activity;
    const __delete = async () => {
        await Delete({
            context,
            ...act.data
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
            Are your sure you want to delete {act.data.type}?
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