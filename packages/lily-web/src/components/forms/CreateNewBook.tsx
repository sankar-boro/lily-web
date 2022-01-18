import { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Node } from "../../globals/types/book";
import { Form } from "../../globals/types";
import { textareaRows, textareaCols } from "../../globals/forms";

const submitBook = (props: {
    title: string;
    body: string;
    identity: number;
    setBookRows: Function;
    bookRows: Node[];
}) => {
    const { title, body, identity, setBookRows, bookRows } = props;
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
        .then((res: AxiosResponse<{ status: number; data: Node }>) => {
            if (
                res.status &&
                typeof res.status === "number" &&
                res.status === 200
            ) {
                setBookRows([...bookRows, ...[res.data]]);
            }
        })
        .catch((err: AxiosError<any>) => {
            // console.log("SignupError", err.response);
        });
};

const CreateNewBook = (props: {
    sectionId: string | null;
    currentFormType: Form;
    setCurrentFormType: Function;
    allPages: any;
    bookId: string | null;
    parentId: string | null;
    activeId: string | null;
    setBookRows: Function;
    bookRows: Node[];
}) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const { allPages, setBookRows, bookRows } = props;
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
                                    identity: 101,
                                    setBookRows,
                                    bookRows,
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
