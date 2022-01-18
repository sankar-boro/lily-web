import { useState } from "react";

const Form102 = (props: any) => {
    const { editTitle, editBody } = props;
    const [_title, setTitle] = useState(editTitle);
    const [_body, setBody] = useState(editBody);
    return (
        <div>
            <div>Create Single Page</div>
            <form action="#" method="post">
                <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    required
                    onChange={(e) => {
                        e.preventDefault();
                        // setTitle(e.target.value);
                    }}
                    value={_title}
                />
                <br />
                <textarea
                    id="body"
                    name="Body"
                    rows={12}
                    cols={50}
                    onChange={(e) => {
                        e.preventDefault();
                        // setBody(e.target.value);
                    }}
                    placeholder="Body of your document."
                    value={_body}
                />
                <br />
                <input
                    className="new-doc-submit-btn"
                    type="button"
                    value="Submit"
                    onClick={(e) => {
                        e.preventDefault();
                        // submitDocument();
                    }}
                />
            </form>
        </div>
    );
};

export default Form102;
