import { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

const submitBook = (props: {
    title: string;
    body: string;
    identity: number;
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

const Form101 = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    return (
        <div className="lg-container">
            <div className="section">Create Front Cover</div>
            <form action="#" method="post">
                <input
                    type="text"
                    placeholder="Enter book title/name"
                    name="title"
                    required
                    onChange={(e) => {
                        e.preventDefault();
                        setTitle(e.target.value);
                    }}
                    value={title}
                />
                <br />
                <textarea
                    id="body"
                    name="Body"
                    rows={12}
                    cols={50}
                    onChange={(e) => {
                        e.preventDefault();
                        setBody(e.target.value);
                    }}
                    placeholder="Body of your document."
                    value={body}
                />
                <br />
                <input
                    className="new-doc-submit-btn"
                    type="button"
                    value="Submit"
                    onClick={(e) => {
                        e.preventDefault();
                        submitBook({
                            title,
                            body,
                            identity: 101,
                        });
                    }}
                />
            </form>
        </div>
    );
};

export default Form101;
