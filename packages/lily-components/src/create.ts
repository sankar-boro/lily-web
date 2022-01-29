import axios from "axios";
import { Result, Ok, Err } from "ts-results";

const log = false;


export const createNode = async (context: any, __formData: any): Promise<Result<any, string>> => {
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
        console.log('uploadData', uploadData)
        return new Promise((resolve) => {
            resolve(Ok(null))
        });
    }

    let url = "http://localhost:8000/book/create/update/any";
    if (formData.url) url = formData.url;
    return await axios
        .post(
            url,
            uploadData,
            {
                withCredentials: true,
            }
        )
        .then((res) => Ok(res.data))
        .catch((err) => Err(err));
}