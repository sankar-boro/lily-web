import { CREATE_NEW_BOOK } from "lily-query";

export const newBookVueData = {
    viewType: 'FORM',
    document: {},
    form: {
        nodeType: 'create_new_book',
        method: 'CREATE',
        url: CREATE_NEW_BOOK,
        data: {
            identity: 101
        } 
    }
}