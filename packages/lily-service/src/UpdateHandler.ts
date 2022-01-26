import { BOOK_SERVICE } from "lily-types";
import { sortAll } from "./DataHandler";

export const updateData = (data: any, props: any) => {
    const {
        title,
        body,
        identity,
        bookId,
        uniqueId
    } = data; 
    const {
        history,
        formContext,
        context
    } = props;

    const { rawData, apiData, dispatch, activePage } = context;
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
                key: 'viewState',
                value: 'NONE'
            }
        ]       
    })
}