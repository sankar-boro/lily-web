import React, { useContext, useEffect, useReducer } from "react";
import { AuthContextType } from "lily-types";
import { LOGIN, SIGNUP, postQuery, postAxios } from 'lily-query';
import { setters } from './ProvidersCommon';
import { useHistory } from "react-router";
import { useAuthQuery } from "lily-utils";

const __login = async (props: any, authenticate: any, notifyError: any) => {
    const {email, password} = props;
    await postAxios({
        url: LOGIN,
        data: {
            email,
            password,
        }
    })
    .then((res: any) => {
        authenticate(res);
    }).catch((err: any) => {
        notifyError(err);
    })
}

const __signup = (props: any, authenticate: any, notifyError: any) => {
    postQuery({ url: SIGNUP, data: props })
    .then((res: any) => {
        authenticate(res);
    })
    .catch((err: any) => {
        notifyError(err);
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

const authenticate = (res: any, dispatch: any, history: any) => {
    if (res && res.status === 200) {
        localStorage.setItem('auth', JSON.stringify(res.data));
        dispatch({
            keys: ['auth', 'authUserData', 'error'],
            values: ['true', res.data, null]
        })
        history.push("/");
    }
}

const notifyError = (err: any, dispatch: any, history: any) => {
    dispatch({
        keys: ['error'],
        values: [err.message]
    })
}

const useAuthenticate = (dispatch: any) => {
    useEffect(() => {
        useAuthQuery(dispatch);
    }, []);
}

export const AuthServiceProvider = (props: { children: object }) => {
    const [state, dispatch] = useReducer(setters, initAuthState);
    const  history = useHistory();
    useAuthenticate(dispatch);

    const __authenticate = (res: any) => {
        authenticate(res, dispatch, history);
    }
    const __notifyError = (res: any) => {
        notifyError(res, dispatch, history);
    }
    const login = (props: any) => {        
        __login(props, __authenticate, __notifyError)
    }
    const signup = (props: any) => {
        __signup(props, __authenticate, __notifyError);
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
