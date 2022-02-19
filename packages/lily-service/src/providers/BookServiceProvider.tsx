import React, { useContext, useEffect, useReducer } from "react";
import { VUE } from "lily-types";
import { BookHandler } from "../BookService";
import { BookActionType, BookContextType, BOOK_SERVICE } from 'lily-types';
import { useHistory } from "react-router";
import { setters } from './ProvidersCommon';

type ApiResponse = any;
type InitFormData = any;

export type FormData = ApiResponse | InitFormData;

const initBookState = {
    rawData: null,
    apiData: null,
    bookId: '',
    formData: {},
    viewData: {},
    editData: {},
    activePage: null,
    dispatch: (data: any): void => {},
    vue: {
        type: 'NONE',
        document: {
            type: null,
        },
        form: {
            type: null,
            method: null,
            data: null,
        }
    },
    service: new BookHandler(),
    notifications: null,
    modal: null,
    activity: null,
    error: ''
}

export const BookContext = React.createContext<BookContextType>({
    rawData: null,
    apiData: null,
    service: new BookHandler(),
    bookId: '',
    formData: {},
    viewData: {},
    editData: {},
    activePage: null,
    error: '',
    dispatch: (data: any): void => {},
    vue: {
        type: 'NONE',
        document: {
            type: null,
        },
        form: {
            type: null,
            method: null,
            data: null,
        }
    },
    notifications: null,
    modal: null,
    activity: null,
});

export const useBookContext = () => useContext(BookContext);

const reducer = (state: BookContextType, action: BookActionType) => {
    const { type } = action;
    switch (type) {
        case BOOK_SERVICE.SETTERS:
            return setters(state, action);
        default:
            throw new Error(`Unknown type: ${action.type}`);
    }
}

const getBookId = (dispatch: any, location: any) => {
    const { state: historyState, pathname }: any = location;
    if (!historyState && pathname) {
        const splitPathName = pathname.split('/').filter((t: string) => t);            
        if (splitPathName.length === 3) {
            dispatch({
                type: BOOK_SERVICE.SETTERS,
                setters: {
                    keys: ['bookId'],
                    values: [splitPathName[2]]
                },
            });
        }
    }
    if (historyState && historyState.bookId) {
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['bookId'],
                values: [historyState.bookId]
            },
        });
    }
}

export const BookServiceProvider = (props: { children: object }) => {
    const [state, dispatch] = useReducer(reducer, initBookState);
    const { location } = useHistory();
    useEffect(() => getBookId(dispatch, location), []);
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
