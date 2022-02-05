import React from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

type OnClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

const logout = (e: OnClickEvent, logoutUser: any) => {
    e.preventDefault();
    axios
        .post(
            "http://localhost:8000/logout",
            {},
            {
                withCredentials: true,
            }
        )
        .then((res: AxiosResponse<{ status: number }>) => {
            if (
                res.status &&
                typeof res.status === "number" &&
                res.status === 200
            ) {
                logoutUser();
            }
        })
        .catch((err: AxiosError<any>) => {
            // console.log("Logout Error", err.response);
        });
};

export { logout };

export type { OnClickEvent };
