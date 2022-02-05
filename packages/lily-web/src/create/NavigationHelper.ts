import { setActivePageFn } from "lily-service";
import { BOOK_SERVICE } from "lily-types";

const usePageTitle = (props: any, context: any) => {
    const { dispatch, apiData } = context;
    const { page } = props;
    const setActivePage = (e: any) => {
        e.preventDefault();
        const activePage = setActivePageFn({
            apiData, 
            compareId: page.uniqueId,
        });
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['activePage'],
                values: [activePage]
            }
        });
    };
    return [page, setActivePage];
}

const useSections = (props: any) => {
    const { page } = props;
    let sections = [];
    if (page.child && Array.isArray(page.child) && page.child.length > 0) {
        sections = page.child;
    }
    return [sections];
}

const useSection = (props: any) => {
    const { page, context, section } = props;
    const { dispatch, apiData } = context;
    const setSection = (e: any) => {
        e.preventDefault();
        const activeSection = setActivePageFn({
            apiData, 
            compareId: section.uniqueId,
        });
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['activePage'],
                values: [activeSection]   
            }
        });
    }
    return [ section, setSection ];
}

const useMain = (context: any) => {
    const { apiData, dispatch } = context;
    const pages = JSON.parse(JSON.stringify(apiData)); 
    return [pages, {dispatch}];
}

export {
    usePageTitle,
    useSection,
    useSections,
    useMain,
}