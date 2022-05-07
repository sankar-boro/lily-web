import React, { useContext, useReducer, useEffect } from "react";
import { HomeContextType, HomeActionType } from "lily-types";
import { getBooks, getBlogs } from "lily-utils";

import { setters } from './ProvidersCommon';

export type HomeState = {
    books: Node[],
    blogs: Node[],
    title: null | string,
    dispatch: (data: any) => void,
};

export const HomeContext = React.createContext<HomeState>({
    books: [],
    blogs: [],
    title: null,
    dispatch: (data: any): void => {}
});

const homeState: HomeState = {
    books: [],
    blogs: [],
    title: null,
    dispatch: (data: any) => {}
}

export const useHomeContext = () => useContext(HomeContext);


const reducer = (state: HomeContextType, action: HomeActionType) => {
    return setters(state, action);
}

export const HomeServiceProvider = (props: { children: object }) => {
    const [state, dispatch] = useReducer(reducer, homeState);

    useEffect(() => getBooks(dispatch), []);
    useEffect(() => getBlogs(dispatch), []);

    return (
        <HomeContext.Provider
            value={{
                ...state,
                dispatch,
            }}
        >
            {props.children}
        </HomeContext.Provider>
    );
};
