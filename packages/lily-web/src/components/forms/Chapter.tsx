import { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { textareaRows, textareaCols } from "../../globals/forms";
import { useBookContext} from "../../service/BookServiceProvider";

const createNewChapter = (props: {
    title: string;
    body: string;
}, context: any) => {
    const { title, body } = props;
    const { formData, bookId } = context;
    const { parentId, identity } = formData;
    axios
        .post(
            "http://localhost:8000/book/create/new/chapter",
            {
                title,
                body,
                identity,
                parentId,
                bookId,
            },
            {
                withCredentials: true,
            }
        )
        .then((res: AxiosResponse<{ status: number }>) => {
            if (
                res.status &&
                typeof res.status === "number" &&
                res.status === 200
            ) {
                // console.log(res);
            }
        })
        .catch((err: AxiosError<any>) => {
            // console.log("SignupError", err.response);
        });
};

const Chapter = () => {
    const context = useBookContext();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    return (
        <div className="flex">
            <div className="con-80 flex">
                <div className="con-10" />
                <div className="con-80">
                    <div className="h3">Create Chapter</div>
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
                                    onClick={(e) => {
                                        e.preventDefault();
                                        createNewChapter({
                                            title,
                                            body,
                                        }, context);
                                    }}
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

export default Chapter;
