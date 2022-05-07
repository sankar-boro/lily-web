import React, { useContext, useReducer } from "react";
import { AuthContextType } from "lily-types";
import { LOGIN, SIGNUP, postQuery, postAxios } from 'lily-query';
import { setters } from './ProvidersCommon';

const __login = async (props: any, dispatch: any) => {
    const {email, password} = props;
    await postAxios({
        url: LOGIN,
        data: {
            email,
            password,
        }
    })
    .then((res: any) => {
        if (res && res.status === 200) {
            localStorage.setItem('auth', res.data);
            dispatch({
                keys: ['auth', 'authUserData', 'error'],
                values: ['true', res.data, null]
            })
        }
    }).catch((err: any) => {
        dispatch({
            keys: ['error'],
            values: [err.message]
        })
    })
}

const __signup = (props: any, dispatch: any) => {
    postQuery({ url: SIGNUP, data: props })
    .then((res: any) => {
        localStorage.setItem('auth', res.data);
        dispatch({
            keys: ['auth', 'authUserData', 'error'],
            values: ['true', res.data, null]
        })
    })
    .catch((err: any) => {
        dispatch({
            type: 'error',
            data: err.message,
        })
    })
}
const initAuthState: AuthContextType = {
    auth: 'init',
    authUserData: null,
    error: null,
    login: (e: any) => {},
    signup: (e: any) => {},
    dispatch: (e: any) => {}
}

const AuthContext = React.createContext<AuthContextType>({
    auth: 'init',
    authUserData: null,
    error: null,
    login: (e: any) => {},
    signup: (e: any) => {},
    dispatch: (e: any) => {}
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthServiceProvider = (props: { children: object }) => {
    const [state, dispatch] = useReducer(setters, initAuthState);
    const login = (props: any) => {
        __login(props, dispatch)
    }
    const signup = (props: any) => {
        __signup(props, dispatch);
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                dispatch,
                login,
                signup
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};
