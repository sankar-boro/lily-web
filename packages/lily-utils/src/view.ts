import { BookContextType, Page, Section } from "lily-types";
import { setActivePageFn } from "./utils";
import { defaultDocView } from "./constants";

export const setActivePage = (context: BookContextType, page: Page) => {
    const { apiData, dispatch } = context;
    const newActivePage = setActivePageFn({
        apiData,
        compareId: page.uniqueId
    });
    dispatch({
        keys: ['activePage', 'vue'],
        values: [newActivePage, defaultDocView]
    })
}

export const setActiveSection = (context: BookContextType, section: Section) => {
    const { apiData, dispatch } = context;
    const newActivePage = setActivePageFn({
        apiData,
        compareId: section.uniqueId
    });
    dispatch({
        keys: ['activePage', 'vue'],
        values: [newActivePage, defaultDocView]
    })
}