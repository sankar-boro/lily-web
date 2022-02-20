import { CREATE_NEW_BOOK } from "lily-query";

export const newBookVueData = {
    viewType: 'FORM',
    document: {},
    form: {
        nodeType: 'NEW_BOOK',
        method: 'CREATE',
        url: CREATE_NEW_BOOK,
        data: {
            identity: 101
        } 
    }
}