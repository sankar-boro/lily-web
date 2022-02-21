import { useEffect, useState } from 'react';
import { BookContextType, BOOK_SERVICE, VUE } from "lily-types";
import { useBookContext} from "lily-service";
import { createNode } from "lily-utils";
import MarkDownForm from './MarkDownForm';

export default function FormComponent() {
    const context: BookContextType = useBookContext();
    const { vue } = context;
    if (!vue.form || !vue.callback) return null;
    if (vue.viewType !== VUE.FORM) return null;
    
    const { data, method, create, update } = vue.form;
    const { callback } = vue;
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    
    useEffect(() => {
        setTitle(data.title);
        setBody(data.body);
    }, [data.title, data.body]);

    return <div>
        <div>
            <h1>{method === 'CREATE' ? create : update}</h1>
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
                onClick={() => {callback({title, body})}}
                >
                Submit
            </button>
        </div>
    </div>
}