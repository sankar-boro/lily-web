import React, { useContext, useEffect, useReducer } from "react";
import { VUE, BOOK_SERVICE, BookContextType, BookActionType } from "lily-types";
import { BookHandler } from "./BookService";

type ApiResponse = any;
type InitFormData = any;

export type FormData = ApiResponse | InitFormData;

const bookState = {
    rawData: null,
    apiData: null,
    bookId: '',
    parentId: '',
    formData: {},
    viewData: {},
    editData: {},
    activePage: null,
    apiState: null,
    error: '',
    dispatch: (data: any) => {},
    vue: VUE.DOCUMENT,
    service: new BookHandler(),
    notifications: null,
}

export const BookContext = React.createContext({
    rawData: null,
    apiData: null,
    service: new BookHandler(),
    bookId: '',
    parentId: '',
    formData: {},
    viewData: {},
    editData: {},
    activePage: [],
    apiState: null,
    error: '',
    dispatch: (data: any) => {},
    vue: VUE.DOCUMENT,
    notifications: null,
});

export const useBookContext = () => useContext(BookContext);

const setters = (state: BookContextType, action: BookActionType) => {
    const { setters } = action;
    const updateData: any = {};
    setters.forEach((setter: any) => {
        updateData[setter.key] = setter.value;
    })
    return { ...state, ...updateData };
}

const settersv1 = (state: BookContextType, action: BookActionType) => {
    const { settersv1 } = action;
    const { keys, values } = settersv1;
    const updateData: any = {};
    if (keys.length === values.length) {
        keys.forEach((keyName: any, keyIndex: any) => {
            updateData[keyName] = values[keyIndex];
        })
    }
    return { ...state, ...updateData };
}

const reducer = (state: BookContextType, action: BookActionType) => {
    const { type } = action;
    
    switch (type) {
        case BOOK_SERVICE.SETTERS:
            return setters(state, action);
        case BOOK_SERVICE.SETTERSV1:
            return settersv1(state, action);
        default:
            throw new Error(`Unknown type: ${action.type}`);
    }
}

export const BookServiceProvider = (props: { children: object }) => {
    const [state, dispatch] = useReducer(reducer, bookState);

    return (
        <BookContext.Provider
            value={{
                ...state,
                dispatch
            }}
        >
            {props.children}
        </BookContext.Provider>
    );
};
