import { sortAll, setActivePageFn } from 'lily-utils';
import { APPEND_BOOK_NODE, postQuery, MERGE_BOOK_NODE, CREATE_NEW_BOOK } from "lily-query";
import { BookContextType, Page, Section, SubSection } from "lily-types";
import { formView, defaultDocView } from "./constants";

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

    let url = botUniqueId ? MERGE_BOOK_NODE : APPEND_BOOK_NODE;
    if (!activePage) url = formData.url;
    return await postQuery({
        url,
        data: uploadData
    });
}

// Don't you dare touch this
const createBook = async (context: BookContextType, formData: any, formResponse: { title: string, body: string}) => {
    const { dispatch } = context;
    const { title, body } = formResponse;
    const { identity } = formData;
    const data = {
        title,
        body,
        identity,
    }
    let res: any = await postQuery({
        url: CREATE_NEW_BOOK,
        data
    });
    let newRawData = [res.data];
    const newApiData = sortAll(newRawData, []);
    let newActivePage = setActivePageFn({
        apiData: newApiData,
        compareId: res.data.uniqueId
    });
    dispatch({
        keys: ['rawData', 'apiData', 'activePage', 'vue', 'bookId'],
        values: [newRawData, newApiData, newActivePage, defaultDocView, res.data.uniqueId]
    })
}


// Don't you dare touch this
export const createNewBookForm = (context: BookContextType) => {
    const { dispatch } = context;
    const formData = {
        titleValue: '',
        bodyValue: '',
        titleLabel: 'Book name',
        bodyLabel: 'Book description',
        identity: 101
    }
    const newBookVueData = {
        document: {},
        form: {
            formTitle: 'Book',
            data: formData,
            callback: (formRes: {title: string, body: string}) => createBook(context, formData, formRes),
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
        values: [newBookVueData]
    })
}

const updateRawData = async (
    context: BookContextType, 
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
    const { dispatch, rawData, bookId, activePage } = context;
    const { title, body } = formResponse;
    const { identity, topUniqueId, botUniqueId } = formData;
    const data = {
        bookId,
        title,
        body,
        identity,
        topUniqueId,
        botUniqueId,
    }
    let res: any = await postQuery({
        url: botUniqueId ? MERGE_BOOK_NODE : APPEND_BOOK_NODE,
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
        bookId,
        identity
    };
    let newRawData = __rawData;
    newRawData.push(newResData);
    let newApiData = sortAll(newRawData, []);
    let newActivePage = setActivePageFn({
        apiData: newApiData,
        compareId: activePage?.uniqueId
    });
    dispatch({
        keys: ['rawData', 'apiData', 'activePage', 'vue'],
        values: [newRawData, newApiData, newActivePage, defaultDocView]
    })
}

export const createNewPage = (
    context: BookContextType, 
    props: { 
        page: any, 
        pages: any 
    }
) => {
    const { dispatch } = context;
    const { page, pages } = props;
    const topUniqueId = page.uniqueId;
    let botUniqueId: any = null;
    pages.forEach((thisPage: any, pageIndex: number) => {
        if (thisPage.uniqueId === page.uniqueId && pages[pageIndex + 1]) {
            botUniqueId = pages[pageIndex + 1].uniqueId;
        }
    })

    const identity = 104;
    const formData: any = {
        title: '',
        body: '',
        identity,
        titleValue: '',
        bodyValue: '',
        titleLabel: 'Chapter name',
        bodyLabel: 'Chapter description',
    }

    if (topUniqueId) {
        formData['topUniqueId'] = topUniqueId;
    }

    if (botUniqueId) {
        formData['botUniqueId'] = botUniqueId;
    }

    const newBookVueData = {
        document: {},
        form: {
            formTitle: 'Chapter',
            data: formData,
            callback: (formRes: {title: string, body: string}) => updateRawData(context, formData, formRes),
            cancel: () => {
                dispatch({
                    keys: ['vue'],
                    values: [defaultDocView]
                })
            }
        },
        ...formView,
    }

    dispatch({
        keys: ['vue'],
        values: [newBookVueData]
    })
}

export const createNewSection = (context: BookContextType, page: Page, section: Section | null) => {
    const {  dispatch } = context;
    const { child: sections } = page; 
    let topUniqueId: any = null;
    let botUniqueId: any = null;
    if (!section) {
        topUniqueId = page.uniqueId;
        if (sections.length > 0) {
            botUniqueId = sections[0].uniqueId;
        }
    } else if (section) {
        topUniqueId = section.uniqueId;
        if (sections.length > 0) {
            for (let i = 0; i < sections.length; i++) {
                if (sections[i].uniqueId === topUniqueId && sections[i + 1]) {
                    botUniqueId = sections[i + 1].uniqueId;
                    break;
                }
            }
        }
    }

    let newFormData = {
        titleValue: '',
        bodyValue: '',
        titleLabel: 'Section name',
        bodyLabel: 'Section description',
        identity: 105,
        topUniqueId,
        botUniqueId
    }
    let vue = {
        document: {},
        form: {
            formTitle: 'Section',
            data: newFormData,
            callback: (
                formResponse: {
                    title: string, 
                    body: string
                }
            ) => updateRawData(context, newFormData, formResponse),
            cancel: () => {
                dispatch({
                    keys: ['vue'],
                    values: [defaultDocView]
                })
            }
        },
        ...formView,
    }
    dispatch({
        keys: ['vue'],
        values: [vue]
    })
}

export const createSubSection = (context: BookContextType, node: SubSection | undefined) => {
    const { activePage, dispatch } = context;
    if (!activePage) return;
    const { child: subSections } = activePage as Section;

    let topUniqueId: any = null;
    let botUniqueId: any = null;
    if (!node) {
        topUniqueId = activePage.uniqueId;
        if (subSections.length > 0) {
            botUniqueId = subSections[0].uniqueId;
        }
    } else if (node) {
        topUniqueId = node.uniqueId;
        if (subSections.length > 0) {
            for (let i = 0; i < subSections.length; i++) {
                if (subSections[i].uniqueId === topUniqueId && subSections[i + 1]) {
                    botUniqueId = subSections[i + 1].uniqueId;
                    break;
                }
            }
        }
    }

    let newFormData = {
        titleValue: '',
        bodyValue: '',
        titleLabel: 'Sub Section name',
        bodyLabel: 'Sub Section description',
        identity: 106,
        topUniqueId,
        botUniqueId
    }
    let vue = {
        document: {},
        form: {
            formTitle: 'Sub Section',
            data: newFormData,
            callback: (
                formResponse: {
                    title: string, 
                    body: string
                }
            ) => updateRawData(context, newFormData, formResponse),
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

