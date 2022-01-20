import axios from "axios";

const log = true;

export const createNode = (props: {
    bookContext: any, 
    identity: number,
    formData: any
}) => {
    const { bookContext, identity, formData } = props;
    const { bookId } = bookContext;
    const { parentId, title, body } = formData;

    let uploadData: any = {
        title,
        body,
    };

    if (parentId) uploadData = {...uploadData, parentId };
    if (bookId) uploadData = { ...uploadData, bookId };
    if (identity) uploadData = { ...uploadData, identity };

    if (log) {
        console.log(uploadData);
        return;
    }

    axios
        .post(
            "http://localhost:8000/book/create/new/section",
            uploadData,
            {
                withCredentials: true,
            }
        )
        .then((res: any) => {
            console.log('res', res)
        })
        .catch((err: any) => {
            console.log('err', err);
        });
}