import { SIGNUP, LOGIN } from "lily-query";
import axios, { AxiosError, AxiosResponse } from "axios";

//
const signup = (props: {
    email: string;
    password: string;
    fname: string;
    lname: string;
    history: any;
}) => {
    const { email, password, fname, lname, history } = props;
    axios
        .post(SIGNUP, {
            email,
            password,
            fname,
            lname,
        })
        .then((res: AxiosResponse<{ status: number }>) => {
            if (
                res.status &&
                typeof res.status === "number" &&
                res.status === 200
            ) {
                history.goBack();
            }
        })
        .catch((err: AxiosError<any>) => {
            // console.log("SignupError", err);
        });
};

export { signup };
