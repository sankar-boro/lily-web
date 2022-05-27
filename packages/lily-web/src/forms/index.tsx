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
    const { titleValue, bodyValue, titleLabel, bodyLabel } = data;

    useEffect(() => {
        setTitle(titleValue);
        setBody(bodyValue);
    }, [titleValue, bodyValue]);

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
            <div className='form-label h4'>
                { titleLabel ? titleLabel : 'Title'}
                <span> </span>
                <span className='required'>required?</span>
            </div>
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
            <div className='form-label h4'>
                { bodyLabel ? bodyLabel : 'Body'}
                <span> </span>
                <span className='required'>required?</span>
            </div>
            <div>
                <MarkDownForm body={body} setBody={setBody} setRequiredBody={setRequiredBody} requiredBody={requiredBody}/>
            </div>
        </div>
        <div>
            <div className="form-button">
                <div className='div-button'>
                    <button
                        type="submit"
                        name="Submit"
                        className="button"
                        onClick={__submit}
                        >
                        Submit
                    </button>
                </div>
                <div className='div-button'>
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
        </div>
    </div>
}