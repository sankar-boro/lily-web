import { CREATE_NEW_BOOK } from "lily-query";

export const newBookVueData = {
    type: 'FORM',
    document: {},
    form: {
        type: 'NEW_BOOK',
        method: 'CREATE',
        url: CREATE_NEW_BOOK,
        data: {
            identity: 101
        } 
    }
}