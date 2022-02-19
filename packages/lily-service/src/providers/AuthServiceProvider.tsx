import React, { useContext, useEffect, useReducer, useState } from "react";
import { AuthContextType, AuthActionType, AUTH_SERVICE } from "lily-types";
import { USER_SESSION, getQueryAuth } from "lily-query";

import { setters } from './ProvidersCommon';

const initAuthState: AuthContextType = {
    auth: '',
    authUserData: null,
    dispatch: () => {},
}

const AuthContext = React.createContext<AuthContextType>({
    auth: '',
    authUserData: null,
    dispatch: (e: any) => {},
});

export const useAuthContext = () => useContext(AuthContext);

const reducer = (state: AuthContextType, action: AuthActionType) => {
    return setters(state, action);
}

const useAuthQuery = (url: string) => {
    const [data, setData] = useState<any>(null);
    const [err, setErr] = useState<any>(null);
    useEffect(() => {
        getQueryAuth({ url })
        .then((res: any) => { 
            if (res.data) {
                setData({
                    data: res.data,
                    auth: true,
                })
            }
        })
        .catch((err) => {
            setErr({
                data: JSON.parse(JSON.stringify(err)), 
                auth: false
            })
        });
    }, []);
    return [data, err];
}

const useAuthDispatch = (authOk: any, authErr: any, dispatch: any) => {
    const [auth, setAuth] = useState('false');
    useEffect(() => {
        if (authOk && authOk.auth) {
            dispatch({
                type: AUTH_SERVICE.SETTERS,
                setters: {
                    keys: ['auth', 'authUserData'],
                    values: ['true', authOk.data]
                }
            })
            setAuth('true');
        }
        if (authErr) {
            dispatch({
                type: AUTH_SERVICE.SETTERS,
                setters: {
                    keys: ['auth'],
                    values: ['false']
                }
            })
            setAuth('false');
        }
    }, [authOk, authErr]);
    return [auth];
}

export const AuthServiceProvider = (props: { children: object }) => {
    const [state, dispatch] = useReducer(reducer, initAuthState);
    const [authData, authErr] = useAuthQuery(USER_SESSION);
    useAuthDispatch(authData, authErr, dispatch);
    
    return (
        <AuthContext.Provider
            value={{
                ...state,
                dispatch,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};
