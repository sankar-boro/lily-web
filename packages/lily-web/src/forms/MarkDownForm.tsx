import { useRef, useState } from 'react';
import { textareaRows, textareaCols, BOOK_SERVICE } from "lily-types";
import { useBookContext} from "lily-service";
import { createNode } from "lily-components";
import MDEditor, { commands, ICommand, TextState, TextAreaTextApi } from '@uiw/react-md-editor';


const data = `# Hello, *world*!`;
let __data = {
    '#356': '',
    '#500': ''
}

const title3: ICommand = {
    name: 'title3',
    keyCommand: 'title3',
    buttonProps: { 'aria-label': 'Insert title3' },
    icon: (
      <svg width="12" height="12" viewBox="0 0 520 520">
        <path fill="currentColor" d="M15.7083333,468 C7.03242448,468 0,462.030833 0,454.666667 L0,421.333333 C0,413.969167 7.03242448,408 15.7083333,408 L361.291667,408 C369.967576,408 377,413.969167 377,421.333333 L377,454.666667 C377,462.030833 369.967576,468 361.291667,468 L15.7083333,468 Z M21.6666667,366 C9.69989583,366 0,359.831861 0,352.222222 L0,317.777778 C0,310.168139 9.69989583,304 21.6666667,304 L498.333333,304 C510.300104,304 520,310.168139 520,317.777778 L520,352.222222 C520,359.831861 510.300104,366 498.333333,366 L21.6666667,366 Z M136.835938,64 L136.835937,126 L107.25,126 L107.25,251 L40.75,251 L40.75,126 L-5.68434189e-14,126 L-5.68434189e-14,64 L136.835938,64 Z M212,64 L212,251 L161.648438,251 L161.648438,64 L212,64 Z M378,64 L378,126 L343.25,126 L343.25,251 L281.75,251 L281.75,126 L238,126 L238,64 L378,64 Z M449.047619,189.550781 L520,189.550781 L520,251 L405,251 L405,64 L449.047619,64 L449.047619,189.550781 Z" />
      </svg>
    ),
    execute: (state: TextState, api: TextAreaTextApi) => {
      let modifyText = `### ${state.selectedText}\n`;
      if (!state.selectedText) {
        modifyText = `### `;
      }
      api.replaceSelection(modifyText);
    },
};

export default function MarkDownForm() {
    const context = useBookContext();
    const { formData, rawData, dispatch }: any = context;
    const { identity }: any = formData;
    const [title, setTitle] = useState("");
    const [body, setBody] = useState(data);
    const bodyRef = useRef<any | null>(null);
    const __onChange = (e: any) => {
        console.log();
        setBody(e.target.value);
    };
    const __onSelectCapture = () => {
        console.log(bodyRef.current.selectionStart);
        console.log(bodyRef.current.selectionEnd);    
    }

    const _submit = async (e: any) => {
        e.preventDefault();
        const __formData = {
            title,
            body,
        }
        let res = await createNode(context, __formData);
        setTitle('');
        setBody('');
        const notiValue = {
            data: res,
            __formData,
            type: formData.type
        };
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['notifications'],
                values: [notiValue]
            }
        })
    }

    if (!formData) return null;
    const _identity = identity && identity.toString();
    const createName: any = {
        "104": "Chapter",
        "105": "Section",
        "106": "Sub Section"
    }

    let name = createName[_identity] ? createName[_identity] : 'Book';

    return <div>
        <div className="h3">Create {name}</div>
        <div className="form-section">
            <h2>Title*</h2>
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
            <h2>Body*</h2>
            <div style={{ paddingTop: 10 }}>
                <textarea ref={bodyRef} onChange={__onChange} value={body} rows={30} cols={70} onSelectCapture={__onSelectCapture}></textarea>
            </div>
        </div>
        <div>
            <button
                type="submit"
                name="Submit"
                className="button"
                onClick={_submit}
                >
                Submit
            </button>
        </div>
    </div>;
};
