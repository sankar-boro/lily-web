import { BOOK_SERVICE, VUE } from "lily-types";
import { sortAll, setActivePageFn } from "./DataHandler";

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
        setters: [
            {
                key: 'rawData',
                value: newRawData,
            },
            {
                key: 'apiData',
                value: newApiData,
            },
            {
                key: 'activePage',
                value: newActivePage
            },
            {
                key: 'vue',
                value: 'NONE'
            }
        ]       
    })
}

export const updatePage = (context: any) => {
    const { notifications, rawData, bookId, activePage, formData, dispatch } = context;
    if (notifications && notifications.type === 'NEW_NODE') {
        const res = notifications.data;
        if (res.err) {
            console.log(res.val);
            return;
        }
        if (!res.val) {
            console.log("App in debug mode.");
            return;
        }
        if (res.val) {
            if (rawData && bookId && activePage) {
                const { __formData } = notifications;
                let resData: any = res.val;
                let __rawData: any[] = [];
                rawData.forEach((__page: any) => {
                    __rawData.push(__page);
                });
                if (formData.topUniqueId && formData.botUniqueId) {
                    __rawData = __rawData.map((__node: any) => {
                        if (__node.uniqueId === formData.botUniqueId) {
                            return {
                                ...__node,
                                parentId: resData.uniqueId,
                            }
                        }
                        return __node;
                    })
                }

                let newResData = {
                    parentId: formData.topUniqueId,
                    uniqueId: resData.uniqueId,
                    title: __formData.title,
                    body: __formData.body,
                    createdAt: resData.uniqueId,
                    updatedAt: resData.uniqueId,
                    bookId,
                    identity: formData.identity
                };
                let newRawData = __rawData;
                newRawData.push(newResData);
                let newApiData = sortAll(newRawData, []);
                let newActivePage = setActivePageFn({
                    apiData: newApiData,
                    compareId: activePage.uniqueId
                });
                dispatch({
                    type: BOOK_SERVICE.SETTERS,
                    setters: [
                        {
                            key: 'rawData',
                            value: newRawData
                        },
                        {
                            key: 'apiData',
                            value: newApiData
                        },
                        {
                            key: 'activePage',
                            value: newActivePage,
                        },
                        {
                            key: 'notifications',
                            value: null,
                        }, 
                        {
                            key: 'formData',
                            value: null,
                        },
                        {
                            key: 'vue',
                            value: VUE.DOCUMENT
                        }
                    ]
                })
            }
        }
    }
}

export const updateNewBook = (context: any) => {
    const { notifications, rawData, dispatch } = context
    if (notifications && notifications.type === 'NEW_BOOK') {
        const res = notifications.data;
        if (res.err) {
            console.log(res.val);
            return;
        }
        if (!res.val) {
            console.log("App in debug mode.");
            return;
        }
        if (res.val) {
            if (!rawData) {
                let resData: any = res.val;
                let bookId = resData.uniqueId;
                let newRawData = [resData];
                let newApiData = sortAll(newRawData, []);
                let newActivePage = setActivePageFn({
                    apiData: newApiData,
                    compareId: bookId
                });
                dispatch({
                    type: BOOK_SERVICE.SETTERS,
                    setters: [
                        {
                            key: 'rawData',
                            value: newRawData
                        },
                        {
                            key: 'apiData',
                            value: newApiData
                        },
                        {
                            key: 'activePage',
                            value: newActivePage,
                        },
                        {
                            key: 'bookId',
                            value: bookId,
                        },
                        {
                            key: 'notifications',
                            value: null,
                        },
                        {
                            key: 'formData',
                            value: null,
                        },
                        {
                            key: 'vue',
                            value: VUE.DOCUMENT
                        }
                    ]
                })
            }
        }
    }
}