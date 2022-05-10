import { useEffect, useState } from 'react';
import MarkDownForm from './MarkDownForm';

export default function FormComponent(props: any) {
    const { context } = props;
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [required, setRequired] = useState('');
    const [requiredBody, setRequiredBody] = useState('');
    const { vue } = context;
    
    const { data, formTitle, callback, cancel } = vue.form;
    useEffect(() => {
        setTitle(data.title);
        setBody(data.body);
    }, [data.title, data.body]);

    const __submit = () => {
        if (!title) {
            setRequired('required-imp');
            return
        };
        if (!body) {
            setRequiredBody('required-imp');
            return;
        }
        setRequired('');
        setRequiredBody('');
        callback({title, body});
    }

    return <div>
        <div>
            <h1>{formTitle}</h1>
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
                className={`form-input ${required}`}
                onMouseDown={() => {
                    setRequired('')
                }}
            />
        </div>
        <div className="form-section">
            <div className='form-label h4'>Body <span className='required'>required?</span></div>
            <div>
                <MarkDownForm body={body} setBody={setBody} setRequiredBody={setRequiredBody} requiredBody={requiredBody}/>
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
            <button
                type="button"
                name="Submit"
                className="button"
                onClick={cancel}
                >
                Cancel
            </button>
        </div>
    </div>
}