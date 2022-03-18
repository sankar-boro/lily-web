import { useBookContext } from "lily-service"
import { BookContextType } from "lily-types";

export const DeleteComponent = () => {
    const context = useBookContext();
    const { modal, dispatch }: BookContextType = context;
    console.log('modal', modal);
    if (modal === null) return null;
    
    return <div>
        <div>
            Are your sure you want to delete {modal.title}?
        </div>
        <div className="margin-top-50"/>
        <div>
            <button onClick={() => {
                modal.delete();
            }} className="button button-delete margin-right-10">
                Delete
            </button>
            <button onClick={() => {
                dispatch({
                    keys: ['modal'],
                    values: [null]
                })
            }} className="button button-cancel">
                Cancel
            </button>
        </div>
    </div>
}