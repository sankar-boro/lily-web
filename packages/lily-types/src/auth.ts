import { DefaultActionType } from 'lily-types';

export enum AUTH_SERVICE {
    SETTERS = 'SETTERS'
}
export type UserInfo = {
    userId: string;
    fname: string;
    lname: string;
    email: string;
};
export type AuthContextType = {
    auth: null | boolean;
    authUserData: null | UserInfo;
    dispatch: (e: any) => void,
}
export type AuthActionType = DefaultActionType;