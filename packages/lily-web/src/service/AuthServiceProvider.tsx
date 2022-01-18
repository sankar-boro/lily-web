import React, { useContext, useEffect, useState } from "react";
import { Option, None, Some } from "ts-results";
import axios, { AxiosError, AxiosResponse } from "axios";

export type UserInfo = {
    userId: string;
    fname: string;
    lname: string;
    email: string;
};
export type AuthService = {
    initializing: boolean;
    auth: boolean;
    authUserData: Option<UserInfo>;
    authToken: Option<string>;
    authenticateUser: (token: UserInfo) => void;
    logoutUser: () => void;
    read: boolean;
    setRead: (value: boolean) => void;
    error: any;
    setError: (e: any) => void;
};
export const AuthContext = React.createContext<AuthService>({
    initializing: true,
    auth: false,
    authUserData: None,
    authToken: None,
    authenticateUser: (token: UserInfo) => {},
    logoutUser: () => {},
    read: false,
    setRead: (value: boolean) => {},
    error: {},
    setError: (e: any) => {},
});
export const useAuthContext = () => useContext(AuthContext);
function clearAllStorage() {
    localStorage.removeItem("auth");
}
const AuthServiceProvider = (props: { children: object }) => {
    const [initializing, setInitializing] = useState(true);
    const [read, setRead_] = useState(false);
    const [authUserData, setAuthUserData] = useState<Option<UserInfo>>(
        Some({
            userId: "1",
            fname: "Sankar",
            lname: "boro",
            email: "sankar.boro@yahoo.com",
        })
    );
    const [auth, setAuth] = useState<boolean>(false);
    const [authToken, setAuthToken] = useState<Option<string>>(None);
    const [error, setError] = useState<any>({});

    useEffect(() => {
        axios
            .get("http://localhost:8000/user/session", {
                withCredentials: true,
            })
            .then((res: AxiosResponse<UserInfo>) => {
                if (res && res.data) {
                    authenticateUser(res.data);
                    setInitializing(false);
                    setInitializing(false);
                }
            })
            .catch((err: AxiosError<any>) => {
                setInitializing(false);
            });
    }, []);
    const authenticateUser = async (userInfo: UserInfo) => {
        setAuthUserData(Some(userInfo));
        setAuth(true);
    };
    const logoutUser = () => {
        setAuth(false);
        clearAllStorage();
        setAuthUserData(None);
        setAuthToken(None);
    };
    const toggleRead = (value: boolean) => {
        setRead_(value);
    };
    return (
        <AuthContext.Provider
            value={{
                auth,
                authUserData,
                authToken,
                initializing,
                authenticateUser,
                logoutUser,
                read,
                setRead: toggleRead,
                error,
                setError: setError,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};
export default AuthServiceProvider;
