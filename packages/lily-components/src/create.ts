import { Result, Ok, Err } from "ts-results";
import { createNodeQuery } from "lily-query";
const log = false;


export const createNode = async (context: any, __formData: any): Promise<Result<any, string>> => {
    const { formData, bookId, activePage } = context;
    const { identity, topUniqueId, botUniqueId } = formData;
    const { title, body } = __formData;
    if(!title || !body) return Err('Title or body not set.');
    let uploadData: any = {
        title,
        body,
    };

    if (bookId) uploadData = { ...uploadData, bookId };
    if (identity) uploadData = { ...uploadData, identity };
    if (topUniqueId) uploadData = { ...uploadData, topUniqueId };
    if (botUniqueId) uploadData = { ...uploadData, botUniqueId };

    if (log) {
        return new Promise((resolve) => {
            resolve(Ok(null))
        });
    }

    let url = "http://localhost:8000/book/create/update/any";
    if (!activePage) url = formData.url;
    return await createNodeQuery({
        url,
        uploadData
    });
}