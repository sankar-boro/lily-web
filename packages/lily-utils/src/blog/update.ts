import { sortBlog } from "../utils";
import { BlogContextType } from "lily-types";
import { formView, defaultDocView } from "../constants";
import { postQuery, UPDATE_BLOG, UPDATE_BLOG_NODE } from "lily-query";

const getUrl = (identity: number) => {
    let __URL = null;
    if (identity === 101) {
        __URL = UPDATE_BLOG
    } else {
        __URL = UPDATE_BLOG_NODE
    }
    return __URL;
}

const updateRawData = (context: BlogContextType, node: any, formResponse: any, res: any) => {
    const { rawData, dispatch } = context;
    const { uniqueId } = node;
    const { title, body } = formResponse;
    if (!rawData) return;
    const newRawData = rawData.map((page: any) => {
        if (page.uniqueId === uniqueId) {
            return { ...page, body, title }
        }
        return page;
    });
    const newApiData = sortBlog(newRawData, []);
    dispatch({
        keys: ['rawData', 'apiData', 'vue'],
        values: [newRawData, newApiData, defaultDocView]
    })
}

const updateNode = async (context: BlogContextType, node: any, formResponse: any) => {
    const { blogId } = context;
    const { uniqueId, identity } = node;
    const { title, body } = formResponse;
    let POSTURL = getUrl(identity);

    await postQuery({
        url: POSTURL,
        data: {
            title,
            body,
            blogId,
            uniqueId
        }
    })
    .then((res) => {
        updateRawData(context, node, formResponse, res);
    });
}

export const editBlog = (context: BlogContextType, node: any) => {
    const { dispatch } = context;
    let formData = {
        title: node.title,
        body: node.body
    }

    let vue = {
        document: {},
        form: {
            formTitle: "Edit Blog",
            data: formData,
            callback: (formResponse: any) => updateNode(context, node, formResponse),
            cancel: () => {
                dispatch({
                    keys: ['vue'],
                    values: [defaultDocView]
                })
            },
        },
        ...formView
    }
    dispatch({
        keys: ['vue'],
        values: [vue]
    })
}

