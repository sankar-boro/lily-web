import { BLOG_SERVICE, Chapter, VUE } from "lily-types";
import { sortAll, setActivePageFn } from "lily-utils";
import { postQuery, UPDATE_BLOG, UPDATE_BLOG_NODE } from "lily-query";
import { BlogContextType, Section, vue, SubSection, Page, HTTP_METHODS } from "lily-types";
import { sortBlog } from "../utils";


// export const updateData = (data: any, props: any) => {
//     const {
//         title,
//         body,
//         uniqueId
//     } = data; 
//     const {
//         context
//     } = props;

//     const { rawData, dispatch, activePage } = context;
//     const newRawData = rawData.map((page: any) => {
//         if (page.uniqueId === uniqueId) {
//             return { ...page, body, title }
//         }
//         return page;
//     })

//     const newApiData = sortAll(newRawData, []);

//     const i = activePage.identity;
//     const _id = activePage.uniqueId;

//     let newActivePage: any = null;
//     let found = false;
//     newApiData.forEach((page: any) => {
//         if (!found && page.uniqueId === _id) {
//             newActivePage = page;
//             found = true;
//         }
//         if (!found) {
//             page.child.forEach((section: any) => {
//                 if (section.uniqueId === _id) {
//                     newActivePage = section;
//                 }
//             });
//         }
//     });

//     dispatch({
//         keys: ['rawData', 'apiData', 'activePage', 'vue'],
//         values: [newRawData, newApiData, newActivePage, 'NONE']
//     })
// }

// export const updatePage = (context: any) => {
//     const { notifications, rawData, blogId, activePage, formData, dispatch } = context;
//     if (!notifications) return null;
//     const { from, to, form } = notifications;
//     const { data, method, fetch } = form;
//     if (method === 'update') {
//         const { topUniqueId, botUniqueId, identity } = data;
//         if (!fetch.data) {
//             return;
//         }
//         if (fetch && fetch.data) {
//             if (rawData && blogId && activePage) {
//                 const { uniqueId } = fetch.data;
//                 const { title, body} = data;
//                 let __rawData: any[] = [];
//                 rawData.forEach((__page: any) => {
//                     __rawData.push(__page);
//                 });
//                 if (topUniqueId && botUniqueId) {
//                     __rawData = __rawData.map((__node: any) => {
//                         if (__node.uniqueId === botUniqueId) {
//                             return {
//                                 ...__node,
//                                 parentId: uniqueId,
//                             }
//                         }
//                         return __node;
//                     })
//                 }

//                 let newResData = {
//                     parentId: topUniqueId,
//                     uniqueId: uniqueId,
//                     title,
//                     body,
//                     createdAt: uniqueId,
//                     updatedAt: uniqueId,
//                     blogId,
//                     identity
//                 };
//                 console.log(newResData);
//                 let newRawData = __rawData;
//                 newRawData.push(newResData);
//                 let newApiData = sortAll(newRawData, []);
//                 let newActivePage = setActivePageFn({
//                     apiData: newApiData,
//                     compareId: activePage.uniqueId
//                 });
//                 const vue = {
//                     viewType: "DOCUMENT",
//                     document: {},
//                     form: {},
//                 }
//                 dispatch({
//                     keys: ['rawData', 'apiData', 'activePage', 'notifications', 'formData', 'vue'],
//                     values: [newRawData, newApiData, newActivePage, null, null, vue]
//                 })
//             }
//         }
//     }
// }

// export const updateNewBlog = (context: any) => {
//     const { notifications, rawData, dispatch } = context
//     if(!notifications) return;
//     const { from, to, form } = notifications;
//     const { data, method, fetch } = form;

//     if (method === 'create') {
//         if (fetch.data) {
//             const { uniqueId } = data;
//             let resData = fetch.data;
//             let blogId = uniqueId;
//             let newRawData = [resData];
//             let newApiData = sortAll(newRawData, []);
//             let newActivePage = setActivePageFn({
//                 apiData: newApiData,
//                 compareId: blogId
//             });
//             dispatch({
//                 keys: ['rawData', 'apiData', 'activePage', 'blogId', 'notifications', 'formData', 'vue'],
//                 values: [newRawData, newApiData, newActivePage, blogId, null, null, VUE.DOCUMENT],
//             })
//         }
//     }
// }

// const __set = (dispatch: any, activePage: any) => {
//     dispatch({
//         keys: ['vue', 'activePage'],
//         values: [VUE.DOCUMENT, activePage]
//     })
// }

// const updateRawData = (context: BlogContextType, newFormData: any, formResponse: any) => {
//     const { rawData, blogId, activePage, dispatch } = context;
//     if (!rawData || !activePage) return;
//     const { res, cache } = formResponse;
//     const { uniqueId } = formResponse.res.data;
//     const { topUniqueId, botUniqueId, identity } = newFormData;
//     const { title, body } = cache;
//     let __rawData: any[] = [];
//     rawData.forEach((__page: any) => {
//         __rawData.push(__page);
//     });
//     if (topUniqueId && botUniqueId) {
//         __rawData = __rawData.map((__node: any) => {
//             if (__node.uniqueId === botUniqueId) {
//                 return {
//                     ...__node,
//                     parentId: uniqueId,
//                 }
//             }
//             return __node;
//         })
//     }

//     let newResData = {
//         parentId: topUniqueId,
//         uniqueId: uniqueId,
//         title,
//         body,
//         createdAt: uniqueId,
//         updatedAt: uniqueId,
//         blogId,
//         identity
//     };
//     let newRawData = __rawData;
//     newRawData.push(newResData);
//     let newApiData = sortAll(newRawData, []);
//     let newActivePage = setActivePageFn({
//         apiData: newApiData,
//         compareId: activePage.uniqueId
//     });
//     let vue: vue = {
//         viewType: "DOCUMENT"
//     }
//     dispatch({
//         keys: ['rawData', 'apiData', 'activePage', 'vue'],
//         values: [newRawData, newApiData, newActivePage, vue]
//     })
// }

// export const editSubSection = (context: BlogContextType, subSection: SubSection) => {
//     const { dispatch } = context;
//     let formData = {
//         title: subSection.title,
//         body: subSection.body,
//         identity: subSection.identity
//     }
//     let vue: vue = {
//         viewType: 'FORM',
//         document: {type: null},
//         form: {
//             method: HTTP_METHODS.UPDATE,
//             create: '',
//             update: 'Update Sub Section',
//             data: formData
//         },
//         callback: (formResponse: any) => updateNode(context, subSection, formResponse),
//         cancel: () => {
//             dispatch({
//                 keys: ['vue'],
//                 values: [{viewType: 'DOCUMENT'}]
//             })
//         }
//     }
//     dispatch({
//         keys: ['vue'],
//         values: [vue]
//     })
// }

const updateNode = async (context: BlogContextType, node: any, formResponse: any) => {
    const { rawData, dispatch, blogId } = context;
    const { uniqueId, identity } = node;
    if (!rawData) return;
    const { title, body } = formResponse;
    
    let updated = false;
    let __URL = null;
    if (identity === 101) {
        __URL = UPDATE_BLOG
    } else {
        __URL = UPDATE_BLOG_NODE
    }

    await postQuery({
        url: __URL,
        data: {
            title,
            body,
            blogId,
            uniqueId
        }
    })
    .then((res) => {
        updated = true;
    });
    
    if (!updated) return;

    const newRawData = rawData.map((page: any) => {
        if (page.uniqueId === uniqueId) {
            return { ...page, body, title }
        }
        return page;
    });
    const newApiData = sortBlog(newRawData, []);
    let vue: vue = {
        viewType: "DOCUMENT"
    }
    dispatch({
        keys: ['rawData', 'apiData', 'vue'],
        values: [newRawData, newApiData, vue]
    })
}

export const editBlog = (context: BlogContextType, node: any) => {
    const { dispatch } = context;
    let formData = {
        title: node.title,
        body: node.body,
        identity: node.identity
    }

    let vue: vue = {
        viewType: 'FORM',
        document: {type: null},
        form: {
            method: HTTP_METHODS.UPDATE, 
            create: '',
            update: 'Update Page',
            data: formData
        },
        callback: (formResponse: any) => updateNode(context, node, formResponse),
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

