import { BlogContextType } from "lily-types";
import { APPEND_BLOG_NODE, postQuery, MERGE_BLOG_NODE, CREATE_NEW_BLOG } from "lily-query";
import { formView, defaultDocView } from "../constants";
import { sortBlog } from "./utils";

const updateContextData = (
    context: BlogContextType, 
    currentNode: any, 
    formResponse: any,
    res: any,
) => {
    const { dispatch, rawData, blogId, apiData } = context;
    const { title, body } = formResponse;
    const { topUniqueId, botUniqueId } = getUniqueIds(apiData, currentNode);
    const { identity } = currentNode;

    const {
        uniqueId
    } = res.data;
    
    if (!rawData) return;
    let __rawData: any[] = [];
    rawData.forEach((__page: any) => {
        __rawData.push(__page);
    });

    if (topUniqueId && botUniqueId) {
        __rawData = __rawData.map((node: any) => {
            if (node.uniqueId === botUniqueId) {
                return {
                    ...node,
                    parentId: uniqueId,
                }
            }
            return node;
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
    dispatch({
        keys: ['rawData', 'apiData', 'vue'],
        values: [newRawData, newApiData, defaultDocView]
    })
}

const updateRawData = async (
    context: BlogContextType, 
    currentNode: any, 
    formResponse: any
) => {
    const { blogId, apiData } = context;
    const { title, body } = formResponse;
    const { identity } = currentNode;
    const { topUniqueId, botUniqueId } = getUniqueIds(apiData, currentNode);
    
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

    updateContextData(
        context, currentNode, formResponse, res
    );
}

// Don't you dare touch this
export const createNewBlogForm = (dispatch: any) => {
    const formData = {
        titleValue: '',
        bodyValue: '',
        titleLabel: 'Blog title',
        bodyLabel: 'Blog Introduction',
        identity: 101
    }
    const newBlogVueData = {
        document: {},
        form: {
            formTitle: 'Blog',
            data: formData,
            callback: (formRes: {title: string, body: string}) => createBlog(dispatch, formData, formRes),
            cancel: () => {
                dispatch({
                    keys: ['vue'],
                    values: [defaultDocView]
                })
            }
        },
        ...formView
    }

    dispatch({
        keys: ['vue'],
        values: [newBlogVueData]
    })
}

const getUniqueIds = (apiData: any, currentNode: any) => {
    let topUniqueId: any = null;
    let botUniqueId: any = null;
    topUniqueId = apiData[0].uniqueId;
    for (let i=0; i < apiData.length; i++) {
        if (apiData[i].uniqueId === currentNode.uniqueId) {
            if (apiData[i + 1]) {
                botUniqueId = apiData[i + 1].uniqueId;
            }
            break;
        }
        topUniqueId = apiData[i].uniqueId;
    }
    return {
        topUniqueId,
        botUniqueId
    }
}

export const createNewNodeBlog = (context: BlogContextType, currentNode: any) => {
    const { apiData, dispatch } = context;
    if (!apiData) return;

    let newFormData = {
        title: '',
        body: ''
    }
    let vue = {
        document: {},
        form: {
            formTitle: 'Create New Node',
            data: newFormData,
            callback: (
                formResponse: any
            ) => updateRawData(context, currentNode, formResponse),
            cancel: () => {
                dispatch({
                    keys: ['vue'],
                    values: [defaultDocView]
                })
            }
        },
        ...formView
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
    dispatch({
        keys: ['rawData', 'apiData', 'vue', 'blogId'],
        values: [newRawData, newApiData, defaultDocView, res.data.uniqueId]
    })
}