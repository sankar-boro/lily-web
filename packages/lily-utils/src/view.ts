import { BookContextType, BOOK_SERVICE, Page, Section } from "lily-types";
import { setActivePageFn } from "./utils";

export const setActivePage = (context: BookContextType, page: Page) => {
    const { activePage, apiData, dispatch } = context;
    const newActivePage = setActivePageFn({
        apiData,
        compareId: page.uniqueId
    });
    let vue = { 
        document: {},
        form: {},
        ...docView()
    }
    dispatch({
        keys: ['activePage', 'vue'],
        values: [newActivePage, vue]
    })
}

const formView = () => {
    return {
        isForm: true,
        isDoc: false,
        isNull: false,
    }
}

const docView = () => {
    return {
        isForm: false,
        isDoc: true,
        isNull: false,
    }
}

export const setActiveSection = (context: BookContextType, section: Section) => {
    const { apiData, dispatch } = context;
    const newActivePage = setActivePageFn({
        apiData,
        compareId: section.uniqueId
    });
    let vue = { 
        document: {},
        form: {},
        ...docView()
    }
    dispatch({
        keys: ['activePage', 'vue'],
        values: [newActivePage, vue]
    })
}