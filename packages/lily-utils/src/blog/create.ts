import { sortAll, setActivePageFn } from 'lily-utils';
import { APPEND_BLOG_NODE, postQuery, MERGE_BLOG_NODE, CREATE_NEW_BLOG } from "lily-query";
import { BlogContextType, HTTP_METHODS, vue } from "lily-types";

import { sortBlog } from "./utils";

const updateRawData = async (
    context: BlogContextType, 
    formData: {
        identity: number,
        topUniqueId: string | null,
        botUniqueId: string | null,
    }, 
    formResponse: { 
        title: string, 
        body: string 
    }
) => {
    const { dispatch, rawData, blogId, activePage } = context;
    const { title, body } = formResponse;
    const { identity, topUniqueId, botUniqueId } = formData;
    const data = {
        blogId,
        title,
        body,
        identity,
        topUniqueId,
        botUniqueId,
    }
    let res: any = await postQuery({
        url: botUniqueId ? MERGE_BLOG_NODE : APPEND_BLOG_NODE,
        data
    });
    const {
        uniqueId
    } = res.data;
    
    if (!rawData) return;
    let __rawData: any[] = [];
    rawData.forEach((__page: any) => {
        __rawData.push(__page);
    });

    if (topUniqueId && botUniqueId) {
        __rawData = __rawData.map((__node: any) => {
            if (__node.uniqueId === botUniqueId) {
                return {
                    ...__node,
                    parentId: uniqueId,
                }
            }
            return __node;
        })
    }

    let newResData = {
        parentId: topUniqueId,
        uniqueId: uniqueId,
        title,
        body,
        createdAt: uniqueId,
        updatedAt: uniqueId,
        blogId,
        identity
    };
    let newRawData = __rawData;
    newRawData.push(newResData);
    let newApiData = sortBlog(newRawData, []);
    let vue: vue = {
        viewType: "DOCUMENT",
    }
    dispatch({
        keys: ['rawData', 'apiData', 'vue'],
        values: [newRawData, newApiData, vue]
    })
}

const formView = () => {
    return {
        isForm: true,
        isDoc: false,
        isNull: false,
    }
}

// Don't you dare touch this
export const createNewBlogForm = (dispatch: any) => {
    const formData = {
        title: '',
        body: '',
        identity: 101
    }
    const newBlogVueData = {
        document: {},
        form: {
            formTitle: 'Create Cover Page',
            data: formData,
            callback: (formRes: {title: string, body: string}) => createBlog(dispatch, formData, formRes),
            cancel: () => {
                dispatch({
                    keys: ['vue'],
                    values: [{viewType: 'DOCUMENT'}]
                })
            }
        },
        ...formView()
    }

    dispatch({
        keys: ['vue'],
        values: [newBlogVueData]
    })
}


export const createNewNodeBlog = (context: BlogContextType, givenode: any) => {
    const { apiData, dispatch } = context;
    if (!apiData) return;
    let topUniqueId: any = null;
    let botUniqueId: any = null;

    topUniqueId = apiData[0].uniqueId;
    for (let i=0; i < apiData.length; i++) {
        if (apiData[i].uniqueId === givenode.uniqueId) {
            if (apiData[i + 1]) {
                botUniqueId = apiData[i + 1].uniqueId;
            }
            break;
        }
        topUniqueId = apiData[i].uniqueId;
    }

    let newFormData = {
        title: '',
        body: '',
        identity: 102,
        topUniqueId,
        botUniqueId
    }
    let vue: vue = {
        viewType: 'FORM',
        document: { type: null },
        form: {
            method: HTTP_METHODS.CREATE,
            create: 'Create New Node',
            update: '', 
            data: newFormData
        },
        callback: (
            formResponse: {
                title: string, 
                body: string
            }
        ) => updateRawData(context, newFormData, formResponse),
        cancel: () => {
            dispatch({
                keys: ['vue'],
                values: [{viewType: 'DOCUMENT'}]
            })
        }
    }
    dispatch({
        keys: ['vue'],
        values: [vue]
    })
}


// Don't you dare touch this
const createBlog = async (dispatch: any, formData: any, formResponse: { title: string, body: string}) => {
    const { title, body } = formResponse;
    const { identity } = formData;
    const data = {
        title,
        body,
        identity,
    }
    let res: any = await postQuery({
        url: CREATE_NEW_BLOG,
        data
    });
    let newRawData = [res.data];
    const newApiData = sortBlog(newRawData, []);
    const vue = {
        viewType: "DOCUMENT",
        document: {},
        form: {},
    }
    dispatch({
        keys: ['rawData', 'apiData', 'vue', 'blogId'],
        values: [newRawData, newApiData, vue, res.data.uniqueId]
    })
}