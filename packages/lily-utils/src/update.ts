import { Chapter, VUE } from "lily-types";
import { sortAll, setActivePageFn } from "lily-utils";
import { postQuery, UPDATE_BOOK, UPDATE_BOOK_NODE } from "lily-query";
import { BookContextType, Section, SubSection, Page } from "lily-types";
import { formView, docView } from "./constants";

export const updateData = (data: any, props: any) => {
    const {
        title,
        body,
        uniqueId
    } = data; 
    const {
        context
    } = props;

    const { rawData, dispatch, activePage } = context;
    const newRawData = rawData.map((page: any) => {
        if (page.uniqueId === uniqueId) {
            return { ...page, body, title }
        }
        return page;
    })

    const newApiData = sortAll(newRawData, []);

    const i = activePage.identity;
    const _id = activePage.uniqueId;

    let newActivePage: any = null;
    let found = false;
    newApiData.forEach((page: any) => {
        if (!found && page.uniqueId === _id) {
            newActivePage = page;
            found = true;
        }
        if (!found) {
            page.child.forEach((section: any) => {
                if (section.uniqueId === _id) {
                    newActivePage = section;
                }
            });
        }
    });

    dispatch({
        keys: ['rawData', 'apiData', 'activePage', 'vue'],
        values: [newRawData, newApiData, newActivePage, 'NONE']
    })
}

export const updatePage = (context: any) => {
    const { notifications, rawData, bookId, activePage, formData, dispatch } = context;
    if (!notifications) return null;
    const { from, to, form } = notifications;
    const { data, method, fetch } = form;
    if (method === 'update') {
        const { topUniqueId, botUniqueId, identity } = data;
        if (!fetch.data) {
            return;
        }
        if (fetch && fetch.data) {
            if (rawData && bookId && activePage) {
                const { uniqueId } = fetch.data;
                const { title, body} = data;
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
                    bookId,
                    identity
                };
                console.log(newResData);
                let newRawData = __rawData;
                newRawData.push(newResData);
                let newApiData = sortAll(newRawData, []);
                let newActivePage = setActivePageFn({
                    apiData: newApiData,
                    compareId: activePage.uniqueId
                });
                const vue = {
                    document: {},
                    form: {},
                    ...docView()
                }
                dispatch({
                    keys: ['rawData', 'apiData', 'activePage', 'notifications', 'formData', 'vue'],
                    values: [newRawData, newApiData, newActivePage, null, null, vue]
                })
            }
        }
    }
}

export const updateNewBook = (context: any) => {
    const { notifications, rawData, dispatch } = context
    if(!notifications) return;
    const { from, to, form } = notifications;
    const { data, method, fetch } = form;

    if (method === 'create') {
        if (fetch.data) {
            const { uniqueId } = data;
            let resData = fetch.data;
            let bookId = uniqueId;
            let newRawData = [resData];
            let newApiData = sortAll(newRawData, []);
            let newActivePage = setActivePageFn({
                apiData: newApiData,
                compareId: bookId
            });
            dispatch({
                keys: ['rawData', 'apiData', 'activePage', 'bookId', 'notifications', 'formData', 'vue'],
                values: [newRawData, newApiData, newActivePage, bookId, null, null, VUE.DOCUMENT],
            })
        }
    }
}

const __set = (dispatch: any, activePage: any) => {
    dispatch({
        keys: ['vue', 'activePage'],
        values: [VUE.DOCUMENT, activePage]
    })
}

const updateRawData = (context: BookContextType, newFormData: any, formResponse: any) => {
    const { rawData, bookId, activePage, dispatch } = context;
    if (!rawData || !activePage) return;
    const { res, cache } = formResponse;
    const { uniqueId } = formResponse.res.data;
    const { topUniqueId, botUniqueId, identity } = newFormData;
    const { title, body } = cache;
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
        bookId,
        identity
    };
    let newRawData = __rawData;
    newRawData.push(newResData);
    let newApiData = sortAll(newRawData, []);
    let newActivePage = setActivePageFn({
        apiData: newApiData,
        compareId: activePage.uniqueId
    });
    let vue = {
        document: {},
        form: {},
        ...docView()
    }
    dispatch({
        keys: ['rawData', 'apiData', 'activePage', 'vue'],
        values: [newRawData, newApiData, newActivePage, vue]
    })
}

export const editSubSection = (context: BookContextType, subSection: SubSection) => {
    const { dispatch } = context;
    let formData = {
        title: subSection.title,
        body: subSection.body,
        identity: subSection.identity
    }
    let vue = {
        document: {},
        form: {
            formTitle: 'Edit Sub Section',
            data: formData,
            callback: (formResponse: any) => updateNode(context, subSection, formResponse),
            cancel: () => {
                dispatch({
                    keys: ['vue'],
                    values: [{
                        document: {},
                        form: {},
                        ...docView()
                    }]
                })
            }
        },
        ...formView()
    }
    dispatch({
        keys: ['vue'],
        values: [vue]
    })
}

const updateNode = async (context: BookContextType, page: Chapter | Page | Section, formResponse: any) => {
    const { rawData, dispatch, activePage, bookId } = context;
    const { uniqueId, identity } = page;
    if (!rawData || !activePage) return;
    const { title, body } = formResponse;
    
    let updated = false;
    let __URL = null;
    if (identity === 101) {
        __URL = UPDATE_BOOK
    } else {
        __URL = UPDATE_BOOK_NODE
    }

    await postQuery({
        url: __URL,
        data: {
            title,
            body,
            bookId,
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
    const newApiData = sortAll(newRawData, []);
    let newActivePage = setActivePageFn({
        apiData: newApiData,
        compareId: activePage.uniqueId
    });
    let vue = {
        document: {},
        form: {},
        ...docView()
    }
    dispatch({
        keys: ['rawData', 'apiData', 'activePage', 'vue'],
        values: [newRawData, newApiData, newActivePage, vue]
    })
}

export const editActivePage = (context: BookContextType, page: Chapter | Page | Section) => {
    const { dispatch } = context;
    let newFormData = {
        title: page.title,
        body: page.body,
        identity: page.identity
    }

    let vue = {
        document: {},
        form: {
            formTitle: 'Create New Node',
            data: newFormData,
            callback: (formResponse: any) => updateNode(context, page, formResponse),
            cancel: () => {
                dispatch({
                    keys: ['vue'],
                    values: [{
                        document: {},
                        form: {},
                        ...docView()
                    }]
                })
            },
            ...formView()
        },
    }
    dispatch({
        keys: ['vue'],
        values: [vue]
    })
}

