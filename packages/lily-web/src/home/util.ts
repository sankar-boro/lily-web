import React from "react";
import { LOGOUT, postQuery } from 'lily-query';

type OnClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

const logout = (e: OnClickEvent, logoutUser: any) => {
    e.preventDefault();
    postQuery({url: LOGOUT, data: {}})
    .then((res: any) => {
        if (
            res.status &&
            typeof res.status === "number" &&
            res.status === 200
        ) {
            logoutUser();
        }
    })
    .catch((err: any) => {
        console.log("Logout failed.");
    });
};

export { logout };

export type { OnClickEvent };
