import { SIGNUP, LOGIN } from "lily-query";
import axios, { AxiosError, AxiosResponse } from "axios";

function login(props: any) {
    const {email, password, context} = props;
    const { authenticateUser, setError } = context;

    axios
        .post(
            LOGIN,
            {
                email,
                password,
            },
            {
                withCredentials: true,
            }
        )
        .then((res: any) => {
            if (res && res.data) {
                authenticateUser(res.data);
            }
        })
        .catch((err: AxiosError<any>) => {
            if (err.response && err.response.data && err.response.data.message) {
                console.log(setError({credentials: err.response.data.message}));
            }
        });
};

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

export { login, signup };
