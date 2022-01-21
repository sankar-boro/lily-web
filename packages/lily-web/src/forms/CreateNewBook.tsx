import { useState } from "react";
import axios from "axios";
import { textareaRows, textareaCols } from "lily-types";

const submitBook = (props: {
    title: string;
    body: string;
    identity: number
}) => {
    const { title, body, identity } = props;
    axios
        .post(
            "http://localhost:8000/book/create/new/book",
            {
                title,
                body,
                identity,
            },
            {
                withCredentials: true,
            }
        )
        .then(() => {})
        .catch(() => {
            // console.log("SignupError", err.response);
        });
};

const CreateNewBook = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    return (
        <div className="container">
            <div className="con-65">
                <div className="h1">Create Front Cover</div>
                <div className="container-form">
                    <form action="#" method="post">
                        <div className="group-form-input">
                            <div className="form-section">
                                <div className="form-label">Enter book title/name*</div>
                                <input
                                    type="text"
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
                                <div className="form-label">Body of your document*</div>
                                <textarea
                                    id="body"
                                    name="Body"
                                    rows={textareaRows}
                                    cols={textareaCols}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setBody(e.target.value);
                                    }}
                                    value={body}
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            name="Submit"
                            className="button button-relative button-secondary"
                            onClick={(e) => {
                                e.preventDefault();
                                submitBook({
                                    title,
                                    body,
                                    identity: 101
                                });
                            }}
                        >
                            Submit
                        </button>
                    </form>
                </div>    
            </div>
        </div>
    );
};

export default CreateNewBook;
