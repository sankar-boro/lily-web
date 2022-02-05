import { useState } from "react";
import { textareaRows, textareaCols, BOOK_SERVICE } from "lily-types";
import { useBookContext} from "lily-service";
import { createNode } from "lily-components";

export default function AllForm() {
    const context = useBookContext();
    const { formData, rawData, dispatch }: any = context;
    const { identity }: any = formData;
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
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

    const _identity = identity && identity.toString();
    const createName: any = {
        "104": "Chapter",
        "105": "Section",
        "106": "Sub Section"
    }

    let name = createName[_identity] ? createName[_identity] : 'Book';

    return (
        <div className="flex">
            <div className="con-80 flex">
                <div className="con-10" />
                <div className="con-80">
                    <div className="h3">Create {name}</div>
                    <div className="container-form">
                        <form action="#" method="post">
                            <div className="group-form-input">
                                <div className="form-section">
                                    <div className="form-label">Title*</div>
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
                                    <div className="form-label">Body*</div>
                                    <textarea
                                        id="body"
                                        name="Body"
                                        rows={textareaRows}
                                        cols={textareaCols}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            setBody(e.target.value);
                                        }}
                                        placeholder="Body of your document."
                                        value={body}
                                        className="form-input"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    name="Submit"
                                    className="button"
                                    onClick={_submit}
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>    
                </div>
                <div className="con-10" />
            </div>
            <div className="con-20" />
        </div>
    );
};
