import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { HomeContextType, HomeActionType, HOME_SERVICE, AUTH_SERVICE } from "lily-types";
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


const setters = (state: HomeContextType, action: HomeActionType) => {
    const { setters } = action;
    if (setters) {
        const { keys, values } = setters;
        const updateData: any = {};
        if (keys.length === values.length) {
            keys.forEach((keyName: any, keyIndex: any) => {
                updateData[keyName] = values[keyIndex];
            })
        }
        return { ...state, ...updateData };
    }
    return state;
}

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
    const { dispatch: authDispatch } = useAuthContext();
    useEffect(() => {
        axios
        .get("http://localhost:8000/book/all", {
            withCredentials: true,
        })
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
            authDispatch({
                type: AUTH_SERVICE.SETTERS,
                setters: {
                    keys: ['auth', 'authUserData'],
                    values: [false, null]
                }
            })
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
