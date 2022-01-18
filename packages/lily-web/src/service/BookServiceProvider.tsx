import React, { useContext, useEffect, useReducer } from "react";
import { FORM_TYPE, BOOK_SERVICE } from "../globals/types";
import { BookHandler } from "./handlers/BookService";

const bookState = {
    apiData: null,
    bookId: '',
    parentId: '',
    formData: {},
    viewData: {},
    editData: {},
    activePage: null,
    hideSection: true,
    apiState: null,
    error: '',
    dispatch: (data: any) => {},
    viewState: FORM_TYPE.NONE,
    service: new BookHandler(),
}

export const BookContext = React.createContext({
    apiData: null,
    service: new BookHandler(),
    bookId: '',
    parentId: '',
    formData: {},
    viewData: {},
    editData: {},
    activePage: [],
    hideSection: true,
    apiState: null,
    error: '',
    dispatch: (data: any) => {},
    viewState: FORM_TYPE.NONE,
});

export const useBookContext = () => useContext(BookContext);

const fetchData = (state: any, dispatch: Function) => {
    const { apiState, service, bookId } = state;
    // We only want this function to be performed once
    if (apiState) return;
    service.fetch(bookId).then((context: any) => {
        let res = context.map_res().data;
        dispatch({
            type: BOOK_SERVICE.SETTER,
            _setter: 'apiData',
            payload: res,
        });
        dispatch({
            type: BOOK_SERVICE.SETTER,
            _setter: 'apiState',
            payload: 'SUCCESS',
        });
    })
}

const setter = (state: any, action: any) => {
    const { payload, _setter } = action;
    return { ...state, [_setter]: payload };
}

const setActivePage = (state: any, action: any) => {
    const { service } = state;
    const { data } = service;
    const { pageId, sectionId } = action;
    let __state = state;
    if (action.sectionId && action.pageId) {
        data.forEach((page: any) => {
            if (page.uniqueId === pageId) {
                page.child.forEach((section: any) => {
                    if (section.uniqueId === sectionId) {
                        const { child, ...others } = section;
                        __state = { ...state, activePage: section, viewData: others, hideSection: false, viewState: FORM_TYPE.NONE };
                    }
                })
            }
        });
    } else {
        data.forEach((page: any) => {
            if (page.uniqueId === pageId) {
                const { child, ...others } = page;
                __state = { ...state, activePage: page, viewData: others, hideSection: true, viewState: FORM_TYPE.NONE };
            }
        });
    }

    return __state;
}

const setters = (state: any, action: any) => {
    const { _setters, _payloads } = action;
    let _state = state;
    _setters.forEach((s: string, index: number) => {
        _state[s] = _payloads[index];
    });
    return _state;
}

const reducer = (state: any, action: any) => {
    const { type, payload, viewType } = action;
    
    switch (type) { 
        case BOOK_SERVICE.SETTER:
            return setter(state, action);
        case BOOK_SERVICE.SETTERS:
            return setters(state, action);
        case BOOK_SERVICE.FORM_PAGE_SETTER: 
            return { ...state, viewState: viewType, formData: payload };
        case BOOK_SERVICE.ACTIVE_PAGE:
            return setActivePage(state, action);
        default:
            throw new Error(`Unknown type: ${action.type}`);
    }
}

export default function BookServiceProvider(props: { children: object }){
    const [state, dispatch] = useReducer(reducer, bookState);
    const { bookId } = state;
    
    useEffect(() => {
        if (bookId) {
            fetchData(state, dispatch);
        }
    },[bookId, state]);

    return (
        <BookContext.Provider
            value={{
                ...state,
                dispatch: dispatch,
            }}
        >
            {props.children}
        </BookContext.Provider>
    );
};
