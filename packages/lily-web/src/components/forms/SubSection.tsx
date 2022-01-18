import { useState } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { textareaRows, textareaCols } from "../../globals/forms";
import { useBookContext } from "../../service/BookServiceProvider";

const createNewSubSection = (props: {
    title: string;
    body: string;
}, context: any) => {
    const { title, body } = props;
    const { formData, bookId } = context;
    const { parentId, identity } = formData;
    console.log(context, props);
    axios
        .post(
            "http://localhost:8000/book/create/new/section",
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

const SubSection = (props: any) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const context = useBookContext();
    return (
        <div className="con-95">
            <div className="h3">Create New Sub-Section</div>
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
                        <div className="form-label">
                            Body*
                        </div>

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
                        className="button button-relative button-secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            createNewSubSection({
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
    );
};

export default SubSection;
