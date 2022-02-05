import React, { useContext, useEffect, useReducer } from "react";
import axios, { AxiosResponse } from "axios";
import { AuthActionType, AuthContextType, AUTH_SERVICE } from "lily-types";

export type UserInfo = {
    userId: string;
    fname: string;
    lname: string;
    email: string;
};
export const AuthContext = React.createContext<AuthContextType>({
    auth: null,
    authUserData: null,
    authToken: null,
    dispatch: (e: any) => {},
});

export const useAuthContext = () => useContext(AuthContext);

const authState: AuthContextType = {
    auth: null,
    authUserData: null,
    authToken: null,
    dispatch: () => {},
}

const setters = (state: AuthContextType, action: AuthActionType) => {
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
    const [state, dispatch] = useReducer(reducer, authState);

    useEffect(() => {
        axios
            .get("http://localhost:8000/user/session", {
                withCredentials: true,
            })
            .then((res: AxiosResponse<UserInfo>) => {
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
