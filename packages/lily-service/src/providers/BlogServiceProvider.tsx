import React, { useContext, useEffect, useReducer } from "react";
import { VUE } from "lily-types";
import { BlogHandler } from "../BlogService";
import { BlogActionType, BlogContextType, vue, BOOK_SERVICE } from 'lily-types';
import { useHistory } from "react-router";
import { setters } from './ProvidersCommon';
import { Dispatcher, SetModalData } from "../index";

const initBlogState = {
    rawData: null,
    apiData: null,
    blogId: '',
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
    service: new BlogHandler(),
    notifications: null,
    modal: null,
    error: '',
    dispatcher: null,
}

export const BlogContext = React.createContext<BlogContextType>({
    rawData: null,
    apiData: null,
    service: new BlogHandler(),
    blogId: '',
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
    dispatcher: null,
});

export const useBlogContext = () => useContext(BlogContext);

const reducer = (state: BlogContextType, action: BlogActionType) => {
    return setters(state, action);
}

const getBlogId = (dispatch: any, location: any) => {
    const { state: historyState, pathname }: any = location;
    if (!historyState && pathname) {
        const splitPathName = pathname.split('/').filter((t: string) => t);            
        if (splitPathName.length === 3) {
            dispatch.setBlogId(splitPathName[2]);
        }
    }
    if (historyState && historyState.blogId) {
        dispatch.setBlogId(historyState.blogId);
    }
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
            keys,
            values
        })
    }

    setApiData(val: any) {
        this.__dispatch(['apiData'], [val]);
    }

    setBlogId(val: any) {
        this.__dispatch(['blogId'], [val]);
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

export const BlogServiceProvider = (props: { children: object }) => {
    const [state, dispatch] = useReducer(reducer, initBlogState);
    const dispatcher = new DispatcherImpl(state, dispatch);
    const { location } = useHistory();
    useEffect(() => getBlogId(dispatcher, location), []);

    return (
        <BlogContext.Provider
            value={{
                ...state,
                dispatch,
                dispatcher,
            }}
        >
            {props.children}
        </BlogContext.Provider>
    );
};
