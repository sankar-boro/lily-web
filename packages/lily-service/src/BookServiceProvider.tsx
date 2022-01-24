import React, { useContext, useEffect, useReducer } from "react";
import { FORM_TYPE, BOOK_SERVICE } from "lily-types";
import { BookHandler } from "./BookService";
import { deleteSubSection } from "./DataHandler";

const bookState = {
    rawData: null,
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
    rawData: null,
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
    viewState: FORM_TYPE.NONE || "UPDATING",
});

export const useBookContext = () => useContext(BookContext);

const fetchData = (state: any, dispatch: Function) => {
    const { apiState, service, bookId } = state;
    // We only want this function to be performed once
    if (apiState) return;
    service.fetch(bookId).then((context: any) => {
        let { data, rawData } = context.map_res();
        dispatch({
            type: BOOK_SERVICE.SETTER,
            _setter: 'apiData',
            payload: data,
        });
        dispatch({
            type: BOOK_SERVICE.SETTER,
            _setter: 'rawData',
            payload: rawData,
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
    let data = { ...state, [_setter]: payload };
    return data;
}

const setActivePage = (state: any, action: any) => {
    const { apiData } = state;
    const { pageId, sectionId } = action;
    let __state = state;
    if (action.sectionId && action.pageId) {
        apiData.forEach((page: any) => {
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
        apiData.forEach((page: any) => {
            if (page.uniqueId === pageId) {
                const { child, ...others } = page;
                __state = { ...state, activePage: page, viewData: others, hideSection: true, viewState: FORM_TYPE.NONE };
            }
        });
    }

    return __state;
}

const setters = (state: any, action: any) => {
    const { setters } = action;
    const updateData: any = {};
    setters.forEach((setter: any) => {
        updateData[setter.key] = setter.value;
    })
    return { ...state, ...updateData };
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
        case 'newState':
            return action.payload;
        default:
            throw new Error(`Unknown type: ${action.type}`);
    }
}

const deleter = (props: any, state: any) => {
    const { action } = props;
    switch (action) {
        case 'deleteSubSection': 
            return deleteSubSection(props, state);
        default: 
            throw new Error(`Unknown action.`);
    }
}

const useDeleter = (deleter: any, dispatch: any, state: any) => {
    const work = (props: any) => {
        const newstate = deleter(props, state);
        if (newstate) dispatch({
            type: 'newState',
            payload: newstate
        });
    };
    return [work];
}

export const BookServiceProvider = (props: { children: object }) => {
    const [state, dispatch] = useReducer(reducer, bookState);
    const [deleteDispatch] = useDeleter(deleter, dispatch, state);

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
                dispatch,
                deleteDispatch
            }}
        >
            {props.children}
        </BookContext.Provider>
    );
};
