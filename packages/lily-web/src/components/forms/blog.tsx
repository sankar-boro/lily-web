import React, { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

const submitBlog = (props: { title: string; description: string }) => {
    const { title, description } = props;
    axios
        .post(
            "http://localhost:8000/book/create",
            {
                title,
                description,
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

const NewBlogForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    return (
        <div className="form-container">
            <div>
                <div className="new-document">
                    <form action="#" method="post">
                        <input
                            type="text"
                            placeholder="Title or Name of the Book"
                            name="title"
                            required
                            onChange={(e) => {
                                e.preventDefault();
                                setTitle(e.target.value);
                            }}
                        />
                        <br />
                        <textarea
                            rows={30}
                            cols={50}
                            placeholder="About your book"
                            onChange={(e) => {
                                e.preventDefault();
                                setDescription(e.target.value);
                            }}
                            required
                        ></textarea>
                        <br />
                        <select
                            name="identity"
                            onChange={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <option value="101">FRONT COVER</option>
                            <option value="102">BACK COVER</option>
                            <option value="103">SINGLE PAGE</option>
                            <option value="104">CHAPTER</option>
                            <option value="105">SECTION</option>
                            <option value="106">SUB-SECTION</option>
                        </select>
                        <br />
                        <input
                            className="new-doc-submit-btn"
                            type="button"
                            value="Submit"
                            onClick={(e) => {
                                e.preventDefault();
                                submitBlog({
                                    title,
                                    description,
                                });
                            }}
                        />
                    </form>
                </div>
            </div>
            <div>
                <div>{title}</div>
                <div>{description}</div>
            </div>
        </div>
    );
};

export default NewBlogForm;
