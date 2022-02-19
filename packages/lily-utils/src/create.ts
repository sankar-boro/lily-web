import { CREATE_UPDATE_ANY, postQuery } from "lily-query";

const log = false;

export const createNode = async (context: any, __formData: any) => {
    const { formData, bookId, activePage, vue } = context;
    const { identity, topUniqueId, botUniqueId } = vue.form.data;
    const { title, body } = __formData;
    if(!title || !body) return null;
    let uploadData: any = {
        title,
        body,
    };
    console.log(uploadData);

    if (bookId) uploadData = { ...uploadData, bookId };
    if (identity) uploadData = { ...uploadData, identity };
    if (topUniqueId) uploadData = { ...uploadData, topUniqueId };
    if (botUniqueId) uploadData = { ...uploadData, botUniqueId };

    if (log) {
        return null;
    }

    let url = CREATE_UPDATE_ANY;
    if (!activePage) url = formData.url;
    return await postQuery({
        url,
        data: uploadData
    });
}