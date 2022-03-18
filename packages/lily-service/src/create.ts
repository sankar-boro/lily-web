import { APPEND_NODE, CREATE_NEW_BOOK, MERGE_NODE, postQuery } from "lily-query";
import { BookContextType, BOOK_SERVICE, HTTP_METHODS, Page, Section, SubSection, vue } from "lily-types";

import { sortAll, setActivePageFn } from './utils';

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
    const vue = {
        viewType: "DOCUMENT",
        document: {},
        form: {},
    }
    dispatch({
        keys: ['rawData', 'apiData', 'activePage', 'vue', 'bookId'],
        values: [newRawData, newApiData, newActivePage, vue, res.data.uniqueId]
    })
}

// Don't you dare touch this
export const createNewBookForm = (context: BookContextType) => {
    const { dispatch } = context;
    const formData = {
        title: '',
        body: '',
        identity: 101
    }
    const newBookVueData = {
        viewType: 'FORM',
        document: {},
        form: {
            method: HTTP_METHODS.CREATE,
            create: 'Create Cover Page',
            identity: 101,
            data: formData
        },
        callback: (formRes: {title: string, body: string}) => createBook(context, formData, formRes)
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
        url: botUniqueId ? MERGE_NODE : APPEND_NODE,
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
    let vue: vue = {
        viewType: "DOCUMENT",
    }
    dispatch({
        keys: ['rawData', 'apiData', 'activePage', 'vue'],
        values: [newRawData, newApiData, newActivePage, vue]
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
    }

    if (topUniqueId) {
        formData['topUniqueId'] = topUniqueId;
    }

    if (botUniqueId) {
        formData['botUniqueId'] = botUniqueId;
    }

    const newBookVueData = {
        viewType: 'FORM',
        document: {},
        form: {
            method: HTTP_METHODS.CREATE,
            create: 'Create New Page',
            identity,
            data: formData
        },
        callback: (formRes: {title: string, body: string}) => updateRawData(context, formData, formRes)
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
        callback: (
            formResponse: {
                title: string, 
                body: string
            }
        ) => updateRawData(context, newFormData, formResponse)
    }
    dispatch({
        keys: ['vue'],
        values: [vue]
    })
}

export const createSubSection = (context: BookContextType, subSection: SubSection | undefined) => {
    const { activePage, dispatch } = context;
    if (!activePage) return;
    const { child: subSections } = activePage as Section;

    let topUniqueId: any = null;
    let botUniqueId: any = null;
    if (!subSection) {
        topUniqueId = activePage.uniqueId;
        if (subSections.length > 0) {
            botUniqueId = subSections[0].uniqueId;
        }
    } else if (subSection) {
        topUniqueId = subSection.uniqueId;
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
        title: '',
        body: '',
        identity: 106,
        topUniqueId,
        botUniqueId
    }
    let vue: vue = {
        viewType: 'FORM',
        document: {type: null},
        form: {
            method: HTTP_METHODS.CREATE,
            create: 'Create New Sub Section',
            update: '', 
            data: newFormData
        },
        callback: (
            formResponse: {
                title: string, 
                body: string
            }
        ) => updateRawData(context, newFormData, formResponse)
    }
    dispatch({
        keys: ['vue'],
        values: [vue]
    })
}