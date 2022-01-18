import { useEffect, useState } from "react";
import axios from "axios";
import { textareaRows, textareaCols } from "../../globals/forms";
import { useBookContext } from "../../service/BookServiceProvider";
import { useFormContext } from "../../service/FormServiceProvider";
import { useHistory } from "react-router";

const submitBook = (data: any, props: any) => {
    const { history, formContext, context } = props;
    const url = "http://localhost:8000/book/update";
    axios.post(
        url,
        data,
        {
            withCredentials: true,
        }
    ).then((res) => {
        const { apiData } = context;
        let newApiData = apiData.map((chapter: any) => {
            if (data.identity === 104 && chapter.uniqueId === data.uniqueId) {
                return {
                    ...chapter,
                    title: data.title,
                    body: data.body,
                }
            } else {
                return chapter.child.map((section: any) => {
                    if (data.identity === 105 && section.uniqueId === data.uniqueId) {
                        return {
                            ...section,
                            title: data.title,
                            body: data.body,
                        }
                    } else {
                        return section.child.map((subSection: any) => {
                            if (subSection.uniqueId === data.uniqueId) {
                                return {
                                    ...subSection,
                                    title: subSection.title,
                                    body: subSection.body,
                                }
                            }
                            return subSection;
                        });
                    }
                });
            }
        });

        context.dispatch({
            type: 'SETTER',
            apiData: newApiData
        })
    }).then(() => {
        history.goBack();
    });
};

const Update = () => {
    const context: any = useBookContext();
    const formContext: any = useFormContext();
    const history: any = useHistory();
    const { formData, bookId, dispatch } = context;
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [identity, setIdentity] = useState<number | null>(null);
    
    useEffect(() => {
        const { title, body, identity } = formData;
        setTitle(title);
        setBody(body);
        setIdentity(identity);
    }, []);

    return (
        <div className="container">
            <div className="container-create-book">
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
                                    identity,
                                    bookId,
                                    uniqueId: formData.uniqueId,
                                }, 
                                {
                                    history,
                                    formContext,
                                    context
                                }
                                );
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

export default Update;
