import { CREATE_NEW_BOOK, postQuery } from "lily-query";
import { setActivePageFn, sortAll } from "lily-service";
import { BookContextType, HTTP_METHODS } from "lily-types";

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
    console.log('res', res);
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
        type: 'SETTERS',
        setters: {
            keys: ['rawData', 'apiData', 'activePage', 'vue'],
            values: [newRawData, newApiData, newActivePage, vue]
        }
    })
}

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
        type: 'SETTERS',
        setters: {
            keys: ['vue'],
            values: [newBookVueData]
        }
    })
}
