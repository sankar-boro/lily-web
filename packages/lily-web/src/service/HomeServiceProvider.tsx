import React, { useContext, useEffect, useReducer } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Node } from "../globals/types/book";

export type HomeState = {
    books: Node[],
    error: string;
    dispatch: Function,
};

const homeState = {
    books: [],
    error: '',
    dispatch: () => {},
}

export const HomeContext = React.createContext<HomeState>({
    books: [],
    error: '',
    dispatch: () => {},
});

export const useHomeContext = () => useContext(HomeContext);

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'INIT':
          return { ...state, apiState: 'INIT' };
    
        case 'SUCCESS':
          return { ...state, books: action.payload, apiState: 'SUCCESS' };
    
        case 'ERROR':
          return { ...state, apiError: action.payload, apiState: 'ERROR' };
            
        default:
            throw new Error(`Unknown type: ${action.type}`);
    }
}

const fetchHomeData = (state: HomeState, dispatch: Function) => {
    dispatch({
        ...state,
        type: 'INIT',
    })
    axios
    .get("http://localhost:8000/book/all", {
        withCredentials: true,
    })
    .then((res: AxiosResponse<[]>) => {
        if (
            res.status &&
            typeof res.status === "number" &&
            res.status === 200
        ) {
            dispatch({
                ...state,
                type: 'SUCCESS',
                payload: res.data,
            });
        }
    })
    .catch((err: AxiosError<any>) => {
        dispatch({
            ...state,
            type: 'ERROR',
            payload: err.response,
        });
    });
}

export default function HomeServiceProvider(props: { children: object }){
    const [state, dispatch] = useReducer(reducer, homeState);
    
    useEffect(() => {
        fetchHomeData(state, dispatch);
    },[]);

    return (
        <HomeContext.Provider
            value={{
                ...state,
                dispatch: dispatch,
            }}
        >
            {props.children}
        </HomeContext.Provider>
    );
};
