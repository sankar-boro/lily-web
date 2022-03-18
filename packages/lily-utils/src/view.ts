import { BookContextType, BOOK_SERVICE, Page, Section } from "lily-types";
import { setActivePageFn } from "./utils";

export const setActivePage = (context: BookContextType, page: Page) => {
    const { activePage, apiData, dispatch } = context;
    const newActivePage = setActivePageFn({
        apiData,
        compareId: page.uniqueId
    });
    let vue = { vue: 'DOCUMENT'}
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
    let vue = { vue: 'DOCUMENT'}
    dispatch({
        keys: ['activePage', 'vue'],
        values: [newActivePage, vue]
    })
}