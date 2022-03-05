import { APPEND_NODE, postQuery, MERGE_NODE } from "lily-query";

const log = false;

export const createNode = async (context: any, formData: any) => {
    const { bookId, activePage, vue } = context;
    const { topUniqueId, botUniqueId } = vue.form.data;
    const { title, body, identity } = formData;
    if(!title || !body) return null;
    let uploadData: any = {
        title,
        body,
    };

    if (bookId) uploadData = { ...uploadData, bookId };
    if (identity) uploadData = { ...uploadData, identity };
    if (topUniqueId) uploadData = { ...uploadData, topUniqueId };
    if (botUniqueId) uploadData = { ...uploadData, botUniqueId };

    if (log) {
        return null;
    }

    let url = botUniqueId ? MERGE_NODE : APPEND_NODE;
    if (!activePage) url = formData.url;
    return await postQuery({
        url,
        data: uploadData
    });
}