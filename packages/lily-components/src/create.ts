import axios from "axios";

const log = true;

export const createNode = (context: any, __formData: any) => {
    const { formData, bookId } = context;
    const { identity, topUniqueId, botUniqueId } = formData;
    const { title, body } = __formData;

    let uploadData: any = {
        title,
        body,
    };

    if (bookId) uploadData = { ...uploadData, bookId };
    if (identity) uploadData = { ...uploadData, identity };
    if (topUniqueId) uploadData = { ...uploadData, topUniqueId };
    if (botUniqueId) uploadData = { ...uploadData, botUniqueId };

    if (log) {
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