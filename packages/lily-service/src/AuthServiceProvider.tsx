import React, { useContext, useEffect, useReducer } from "react";
import { None } from "ts-results";
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
    const updateData: any = {};
    setters?.forEach((setter: any) => {
        updateData[setter.key] = setter.value;
    })
    return { ...state, ...updateData };
}

const settersv1 = (state: AuthContextType, action: AuthActionType) => {
    const { settersv1 } = action;
    if (settersv1) {
        const { keys, values } = settersv1;
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
        case AUTH_SERVICE.SETTERSV1:
            return settersv1(state, action);
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
                        type: AUTH_SERVICE.SETTERSV1,
                        settersv1: {
                            keys: ['auth', 'authUserData'],
                            values: [true, res.data]
                        }
                    })
                }
            })
            .catch((err: any) => {
                dispatch({
                    type: AUTH_SERVICE.SETTERSV1,
                    settersv1: {
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
