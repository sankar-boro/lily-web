import axios, { AxiosError, AxiosResponse } from "axios";

const EditDocumentForm = (props: {
    title: string;
    tags: string;
    body: string;
    setTitle: any;
    setTags: any;
    setBody: any;
}) => {
    const { title, tags, body, setTitle, setTags, setBody } = props;
    const submitDocument = () => {
        axios
            .post(
                "http://localhost:8000/post/create",
                {
                    title,
                    tags,
                    body,
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

    return (
        <div className="new-document">
            <form action="#" method="post">
                <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    required
                    onChange={(e) => {
                        e.preventDefault();
                        setTitle(e.target.value);
                    }}
                />
                <br />
                <input
                    type="text"
                    placeholder="Tags"
                    name="tags"
                    required
                    onChange={(e) => {
                        e.preventDefault();
                        setTags(e.target.value);
                    }}
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
                />
                <br />
                <input
                    className="new-doc-submit-btn"
                    type="button"
                    value="Submit"
                    onClick={(e) => {
                        e.preventDefault();
                        submitDocument();
                    }}
                />
            </form>
        </div>
    );
};

export default EditDocumentForm;
