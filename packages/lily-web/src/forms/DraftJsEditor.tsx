import React, { useState } from "react";
import { textareaRows, textareaCols, BOOK_SERVICE } from "lily-types";
import { useBookContext} from "lily-service";
import { createNode } from "lily-components";
// import MDEditor from '@uiw/react-md-editor';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { data } from "./samples";
import {Editor, EditorState, RichUtils } from 'draft-js';


export default function MarkDownForm() {
    const context = useBookContext();
    const { formData, rawData, dispatch }: any = context;
    const { identity }: any = formData;
    const [title, setTitle] = useState("");
    // const [body, setBody] = useState(data);
    const [body, setBody] = useState(EditorState.createEmpty());
    const _submit = async (e: any) => {
        e.preventDefault();
        const __formData = {
            title,
            body,
        }
        let res = await createNode(context, __formData);
        setTitle('');
        setBody(EditorState.createEmpty());
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

    const __onChange = (editorState: EditorState) => {
        setBody(editorState)
    };

    const __onBoldClick = () => {
        __onChange(RichUtils.toggleInlineStyle(body, 'BOLD'));
    }

    const handleKeyCommand = (command: string, editorState: EditorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
    
        if (newState) {
          __onChange(newState);
          return 'handled';
        }
    
        return 'not-handled';
      }

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
                <button onClick={() => {__onBoldClick()}}>Bold</button>
                <div style={{ border: "1px solid #ccc", marginTop: 10, marginBottom: 10, height: 200 }}>
                    <Editor
                        editorState={body}
                        handleKeyCommand={(command: string, editorState: EditorState, eventTimeStamp: number) => {
                            return handleKeyCommand(command, editorState) ? 'handled' : 'not-handled';
                        }}
                        onChange={(editorState: EditorState) => {
                            __onChange(editorState);
                        }}
                    />
                </div>
            </div>

            <div>
                <code>
                    {`function hello() {

                    }`}
                </code>
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
