import { BookContextType, Page, Section } from "lily-types";
import { setActivePageFn } from "./utils";
import { docView } from "./constants";

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