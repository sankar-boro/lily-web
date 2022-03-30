import { useBlogContext } from "lily-service"
import { BlogContextType } from "lily-types";

export const DeleteComponent = () => {
    const context = useBlogContext();
    const { modal, dispatch }: BlogContextType = context;

    if (modal === null) return null;
    
    return <div>
        <div>
            {modal.title}
        </div>
        <div className="margin-top-50"/>
        <div>
            {modal.body && modal.body.map((body: any) => {
                return <div style={{marginBottom: 10 }}>
                    <h4>{body.title}</h4>
                    <div>{body.body}</div>
                </div>
            })}
        </div>
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