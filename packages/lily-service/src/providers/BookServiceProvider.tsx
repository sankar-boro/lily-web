import React, { useContext, useEffect, useReducer } from "react";
import { VUE } from "lily-types";
import { BookHandler } from "../BookService";
import { BookActionType, BookContextType, vue, BOOK_SERVICE } from 'lily-types';
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
            method: null,
            data: null,
            url: null,
        },
        callback: (res: any) => {}
    },
    service: new BookHandler(),
    notifications: null,
    modal: null,
    activity: null,
    error: '',
    dispatcher: null,
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
        viewType: 'NONE',
        document: {
            type: null,
        },
        form: {
            method: '',
            data: null,
            create: '',
            update: ''
        },
        callback: (res: any) => {}
    },
    notifications: null,
    modal: null,
    activity: null,
    dispatcher: null,
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
            dispatch.setBookId(splitPathName[2]);
        }
    }
    if (historyState && historyState.bookId) {
        dispatch.setBookId(historyState.bookId);
    }
}

export type SetModalData = {
    show: boolean,
    action: string,
    data: any,
}

export interface Dispatcher {
    setModal: (data: SetModalData) => void,
    setKeyVal: (key: any, val: any) => void,
    setVue: (data: vue) => void,
    setFrom: (obj: any) => void,
}

class DispatcherImpl implements Dispatcher {
    state: any = null;
    dispatch: any = null;
    constructor(state: any, dispatch: any) {
        this.state = state;
        this.dispatch = dispatch;
    }

    __dispatch(keys: any, values: any) {
        this.dispatch({
            type: 'SETTERS',
            setters: {
                keys,
                values
            }
        })
    }

    setApiData(val: any) {
        this.__dispatch(['apiData'], [val]);
    }

    setBookId(val: any) {
        this.__dispatch(['bookId'], [val]);
    }

    setKeyVal(key: string, val: any) {
        this.__dispatch([key], [val]);
    }

    setVue(data: vue) {
        this.__dispatch(['vue'], [data]);
    }

    setFrom(obj: any) {
        let keys: any = [];
        let vals: any = [];
        Object.entries(obj).forEach((entry: any) => {
            const [key, val] = entry;
            keys.push(key);
            vals.push(val);
        })
        this.__dispatch(keys, vals);
    }

    setModal(modalData: SetModalData) {
        this.__dispatch(['modal'], [modalData])
    }
}

export const BookServiceProvider = (props: { children: object }) => {
    const [state, dispatch] = useReducer(reducer, initBookState);
    const dispatcher = new DispatcherImpl(state, dispatch);
    const { location } = useHistory();
    useEffect(() => getBookId(dispatcher, location), []);

    return (
        <BookContext.Provider
            value={{
                ...state,
                dispatch,
                dispatcher,
            }}
        >
            {props.children}
        </BookContext.Provider>
    );
};
