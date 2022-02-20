import { useEffect, useState } from 'react';
import { BookContextType, BOOK_SERVICE, VUE } from "lily-types";
import { useBookContext} from "lily-service";
import { createNode } from "lily-utils";
import MarkDownForm from './MarkDownForm';

export default function FormComponent() {
    const context: BookContextType = useBookContext();
    const {vue, dispatch } = context;
    if (vue.viewType !== VUE.FORM) return null;
    const { data, method, nodeType } = vue.form;
    const [title, setTitle] = useState(data.title ? data.title : '');
    const [body, setBody] = useState(data.body ? data.body : '');
    const [identity] = useState(data.identity ? data.identity : 0);
    if (!identity) return null;
    const createName: any = {
        "104": "Chapter",
        "105": "Section",
        "106": "Sub Section"
    }
    let name = createName[identity] ? createName[identity] : 'Book';

    const __submit = async () => {
        let res: any = await createNode(context, {title, body});
        let cache: any = {
            title, 
            body,
            identity
        }
        if (data.topUniqueId) cache['topUniqueId'] = data.topUniqueId;    
        if (data.botUniqueId) cache['botUniqueId'] = data.botUniqueId;
        let newNotification = {
            from: 'FORM',
            to: 'DOCUMENT',
            form: {
                cache,
                fetch: res,
                method,
            }
        }
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['notifications'],
                values: [newNotification]
            }
        })
        setTitle('')
        setBody('')  
    }
    return <div>
        <div>
            <h1>Create {name}</h1>
        </div>
        <div className="form-section">
            <div className='form-label h4'>Title <span className='required'>required?</span></div>
            <input
                type="text"
                placeholder="Title"
                name="title"
                required
                onChange={(e) => {
                    e.preventDefault();
                    setTitle(e.target.value);
                }}
                value={title}
                className="form-input"
            />
        </div>
        <div className="form-section">
            <div className='form-label h4'>Body <span className='required'>required?</span></div>
            <div>
                <MarkDownForm body={body} setBody={setBody} />
            </div>
        </div>
        <div>
            <button
                type="submit"
                name="Submit"
                className="button"
                onClick={__submit}
                >
                Submit
            </button>
        </div>
    </div>
}