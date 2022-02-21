import { BOOK_SERVICE, VUE } from "lily-types";
import { sortAll, setActivePageFn } from "./utils";

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
        type: BOOK_SERVICE.SETTERS,
        setters: {
            keys: ['rawData', 'apiData', 'activePage', 'vue'],
            values: [newRawData, newApiData, newActivePage, 'NONE']
        }    
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
                    viewType: "DOCUMENT",
                    document: {},
                    form: {},
                }
                dispatch({
                    type: BOOK_SERVICE.SETTERS,
                    setters: {
                        keys: ['rawData', 'apiData', 'activePage', 'notifications', 'formData', 'vue'],
                        values: [newRawData, newApiData, newActivePage, null, null, vue]
                    }
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
                type: BOOK_SERVICE.SETTERS,
                setters: {
                    keys: ['rawData', 'apiData', 'activePage', 'bookId', 'notifications', 'formData', 'vue'],
                    values: [newRawData, newApiData, newActivePage, bookId, null, null, VUE.DOCUMENT],
                }
            })
        }
    }
}