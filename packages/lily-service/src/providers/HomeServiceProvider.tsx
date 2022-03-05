import React, { useContext, useEffect, useReducer } from "react";
import { HomeContextType, HomeActionType, HOME_SERVICE, AUTH_SERVICE } from "lily-types";
import { GET_BOOK_ALL, getQueryAuth } from "lily-query";

import { setters } from './ProvidersCommon';
import { useAuthContext } from "./AuthServiceProvider";

export type HomeState = {
    books: Node[],
    title: null | string,
    dispatch: (data: any) => void,
};

export const HomeContext = React.createContext<HomeState>({
    books: [],
    title: null,
    dispatch: (data: any): void => {}
});

const homeState: HomeState = {
    books: [],
    title: null,
    dispatch: (data: any) => {}
}

export const useHomeContext = () => useContext(HomeContext);


const reducer = (state: HomeContextType, action: HomeActionType) => {
    const { type } = action;
    
    switch (type) {
        case HOME_SERVICE.SETTERS:
            return setters(state, action);
        default:
            throw new Error(`Unknown type: ${action.type}`);
    }
}

export const HomeServiceProvider = (props: { children: object }) => {
    const [state, dispatch] = useReducer(reducer, homeState);
    useEffect(() => {
        getQueryAuth({ url: GET_BOOK_ALL})
        .then((res: any) => {
            if (
                res.status &&
                typeof res.status === "number" &&
                res.status === 200
            ) {
                dispatch({
                    type: HOME_SERVICE.SETTERS,
                    setters: {
                        keys: ['books'],
                        values: [res.data]
                    }
                })
            }
        })
        .catch((err) => {
        });
    },[]);

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
