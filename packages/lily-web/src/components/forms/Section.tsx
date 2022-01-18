import { useState } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { textareaRows, textareaCols } from "../../globals/forms";
import { useBookContext } from "../../service/BookServiceProvider";

const createNewSection = (props: {
    title: string;
    body: string;
}, context: any) => {
    const { title, body } = props;
    const { bookId, formData } = context;
    const { identity, parentId } = formData;
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

const Section = (props: any) => {
    const context = useBookContext();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const { bookId, parentId } = props;
    return (
        <div className="flex">
            <div className="con-80 flex">
                <div className="con-10" />
                <div className="con-80" >
                    <div className="h3">Add Section</div>
                    <div className="container-form">
                        <form action="#" method="post">
                            <div className="group-form-input">
                                <div className="form-section">
                                    <div className="form-label">Title*</div>
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
                                        createNewSection({
                                            title,
                                            body
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

export default Section;
