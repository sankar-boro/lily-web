import React, { useContext, useEffect, useReducer, useState } from "react";
import { BlogHandler } from "../BlogService";
import { BlogActionType, BlogContextType } from 'lily-types';
import { useHistory } from "react-router";
import { setters } from './ProvidersCommon';
import { createNewBlogForm } from "lily-utils";

const initVue = {
    isDoc: true,
    isForm: false,
    isNull: false
}

const initBlogState = {
    rawData: null,
    apiData: null,
    blogId: '',
    formData: {},
    viewData: {},
    editData: {},
    activePage: null,
    dispatch: (data: any): void => {},
    vue: initVue,
    service: new BlogHandler(),
    notifications: null,
    modal: null,
    error: '',
    dispatcher: null,
}

export const BlogContext = React.createContext<BlogContextType>({
    rawData: null,
    apiData: null,
    blogId: '',
    formData: {},
    viewData: {},
    editData: {},
    activePage: null,
    error: '',
    dispatch: (data: any): void => {},
    vue: initVue,
    notifications: null,
    modal: null
});

export const useBlogContext = () => useContext(BlogContext);

const reducer = (state: BlogContextType, action: BlogActionType) => {
    return setters(state, action);
}

const getBlogId = (location: any, dispatch: any) => {
    const [blogId, setBlogId] = useState();
    
    useEffect(() => {
        const { state: historyState, pathname }: any = location;
        if (!historyState && pathname) {
            const splitPathName = pathname.split('/').filter((t: string) => t);            
            if (splitPathName.length === 3) {
                dispatch({ keys: ['blogId'], values: [splitPathName[2]]})
                setBlogId(splitPathName[2]);
            }
        } else if (historyState && historyState.blogId) {
            dispatch({ keys: ['blogId'], values: [historyState.blogId]})
            setBlogId(historyState.blogId);
        }
        if (pathname.includes('new/blog')) {
            createNewBlogForm(dispatch);
        }
    }, [])
    return [blogId];
}

const useBlogFetch = (blogId: string | null | undefined, dispatch: any) => {
    const [hasBlogData, setHasBlogData] = useState('null');
    useEffect(() => {
        if (!blogId) return;
        const service = new BlogHandler();
        service.fetch(blogId)
        .then((res) => res.map_res())
        .then((res) => {
            const { rawData, apiData } = res;
            dispatch({
                keys: ['rawData', 'apiData'],
                values: [ rawData, apiData ]
            })
            setHasBlogData('true');
        })
        .catch((err: any) => {
            dispatch({
                keys: ['error'],
                values: [ err ]
            })
            setHasBlogData('false');
        })
    }, [blogId]);
    return [hasBlogData];
}

const useVue = (hasBlogData: any, dispatch: any) => {
    useEffect(() => {
        if (hasBlogData === 'true') {
            dispatch({
                keys: ['vue'],
                values: [initVue]
            });
        }
    }, [hasBlogData]);
}

export const BlogServiceProvider = (props: { children: object }) => {
    const [state, dispatch] = useReducer(reducer, initBlogState);
    const { location } = useHistory();
    
    const [blogId] = getBlogId(location, dispatch);
    const [hasBlogData] = useBlogFetch(blogId, dispatch);
    useVue(hasBlogData, dispatch);

    return (
        <BlogContext.Provider
            value={{
                ...state,
                blogId,
                dispatch
            }}
        >
            {props.children}
        </BlogContext.Provider>
    );
};
