import React, { useContext, useEffect, useReducer } from "react";
import { AuthContextType, AuthActionType, AUTH_SERVICE } from "lily-types";
import { USER_SESSION, getQueryAuth } from "lily-query";

import { setters } from './ProvidersCommon';

const initAuthState: AuthContextType = {
    auth: null,
    authUserData: null,
    dispatch: () => {},
}

const AuthContext = React.createContext<AuthContextType>({
    auth: null,
    authUserData: null,
    dispatch: (e: any) => {},
});

export const useAuthContext = () => useContext(AuthContext);

const reducer = (state: AuthContextType, action: AuthActionType) => {
    const { type } = action;
    switch (type) {
        case AUTH_SERVICE.SETTERS:
            return setters(state, action);
        default:
            throw new Error(`Unknown type: ${action.type}`);
    }
}

export const AuthServiceProvider = (props: { children: object }) => {
    const [state, dispatch] = useReducer(reducer, initAuthState);

    useEffect(() => {
        getQueryAuth({ url: USER_SESSION})
            .then((res: any) => {
                if (res && res.data) {
                    dispatch({
                        type: AUTH_SERVICE.SETTERS,
                        setters: {
                            keys: ['auth', 'authUserData'],
                            values: [true, res.data]
                        }
                    })
                }
            })
            .catch((err: any) => {
                dispatch({
                    type: AUTH_SERVICE.SETTERS,
                    setters: {
                        keys: ['auth'],
                        values: [false]
                    }
                })
            });
    }, []);
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
