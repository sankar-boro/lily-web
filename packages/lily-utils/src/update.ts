import { BOOK_SERVICE, Chapter, VUE } from "lily-types";
import { sortAll, setActivePageFn } from "lily-utils";
import { postQuery, UPDATE_BOOK, UPDATE_BOOK_NODE } from "lily-query";
import { BookContextType, Section, vue, SubSection, Page, HTTP_METHODS } from "lily-types";


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
                    viewType: "DOCUMENT",
                    document: {},
                    form: {},
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
    let vue: vue = {
        viewType: "DOCUMENT"
    }
    dispatch({
        keys: ['rawData', 'apiData', 'activePage', 'vue'],
        values: [newRawData, newApiData, newActivePage, vue]
    })
}

export const getPageProps = (props: any, context: BookContextType) => {
    const { apiData, dispatch, dispatcher } = context;
    const { page, pages } = props;
    let sections: any = null;
    if (page.child && Array.isArray(page.child) && page.child.length > 0) {
        sections = page.child;
    }

    return {
        page,
        getSections: () => {
            if (!sections) return null;
            if (sections && sections.length === 0) return null;
            return sections;
        },
        setActiveSection: (section: Section) => {
            const activePage_ = setActivePageFn({
                apiData,
                compareId: section.uniqueId
            });
            __set(dispatch, activePage_);
        },
        createNewSection: () => {
            const { child: sections } = page;
            const topUniqueId = page.uniqueId;
            let botUniqueId = null;
            if (sections && Array.isArray(sections) && sections.length > 0) {
                botUniqueId = sections[0].uniqueId;
            }
            let newFormData = {
                title: '',
                body: '',
                identity: 105,
                topUniqueId,
                botUniqueId
            }
            let vue: vue = {
                viewType: 'FORM',
                document: {type: null},
                form: { 
                    method: HTTP_METHODS.CREATE,
                    create: 'Create New Section',
                    update: '', 
                    data: newFormData,
                },
                callback: (formResponse: any) => updateRawData(context, newFormData, formResponse),
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
        },
        createNewChapter: () => {
            const topUniqueId = page.uniqueId;
            let botUniqueId: any = null;
            pages.forEach((_page: any, pageIndex: number) => {
                if (_page.uniqueId === page.uniqueId && pages[pageIndex + 1]) {
                    botUniqueId = pages[pageIndex + 1].uniqueId;
                }
            })
            let newFormData = {
                title: '',
                body: '',
                identity: 105,
                topUniqueId,
                botUniqueId
            }
            let vue: vue = {
                viewType: 'FORM',
                document: {type: null},
                form: {
                    method: HTTP_METHODS.CREATE,
                    create: 'Create New Chapter',
                    update: '',
                    data: newFormData 
                },
                callback: (formResponse: any) => updateRawData(context, newFormData, formResponse),
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
        },
        createSection: (section: Section) => {
            const topUniqueId = section.uniqueId;
            let botUniqueId: any = null;
    
            sections.forEach((_section: any, sectionIndex: number) => {
                if (_section.uniqueId === section.uniqueId && sections[sectionIndex + 1]) {
                    botUniqueId = sections[sectionIndex + 1].uniqueId;
                }
            })
            let newFormData = {
                title: '',
                body: '',
                identity: 105,
                topUniqueId,
                botUniqueId
            }
            let vue: vue = {
                viewType: 'FORM',
                document: {type: null},
                form: {
                    method: HTTP_METHODS.CREATE,
                    create: 'Create New Section',
                    update: '', 
                    data: newFormData
                },
                callback: (formResponse: any) => updateRawData(context, newFormData, formResponse),
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
    }
}

export const editSubSection = (context: BookContextType, subSection: SubSection) => {
    const { dispatch } = context;
    let formData = {
        title: subSection.title,
        body: subSection.body,
        identity: subSection.identity
    }
    let vue: vue = {
        viewType: 'FORM',
        document: {type: null},
        form: {
            method: HTTP_METHODS.UPDATE,
            create: '',
            update: 'Update Sub Section',
            data: formData
        },
        callback: (formResponse: any) => updateNode(context, subSection, formResponse),
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
    let vue: vue = {
        viewType: "DOCUMENT"
    }
    dispatch({
        keys: ['rawData', 'apiData', 'activePage', 'vue'],
        values: [newRawData, newApiData, newActivePage, vue]
    })
}

export const editActivePage = (context: BookContextType, page: Chapter | Page | Section) => {
    const { dispatch } = context;
    let formData = {
        title: page.title,
        body: page.body,
        identity: page.identity
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
        callback: (formResponse: any) => updateNode(context, page, formResponse),
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

