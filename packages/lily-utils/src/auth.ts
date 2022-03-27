import { AuthContextType } from "lily-types";
import { callAxios, USER_SESSION } from "lily-query";

export const useAuthQuery = (context: AuthContextType) => {
    const { dispatch } = context;

    const callBack = (res: any) => {
        let auth = 'false'; 
        let data = null;
        if (res.isTrue) {
            auth = 'true';
            data = res.data;
        }
        dispatch({
            keys: ['auth', 'authUserData'],
            values: [auth, data]
        })
    }

    callAxios({url: USER_SESSION, callBack })
}