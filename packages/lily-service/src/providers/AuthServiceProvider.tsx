import React, { useContext, useReducer } from "react";
import { AuthContextType } from "lily-types";

import { setters } from './ProvidersCommon';

const initAuthState: AuthContextType = {
    auth: 'init',
    authUserData: null,
    dispatch: () => {},
}

const AuthContext = React.createContext<AuthContextType>({
    auth: 'init',
    authUserData: null,
    dispatch: (e: any) => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthServiceProvider = (props: { children: object }) => {
    const [state, dispatch] = useReducer(setters, initAuthState);
    
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
