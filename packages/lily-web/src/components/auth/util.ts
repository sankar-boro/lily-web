import axios, { AxiosError, AxiosResponse } from "axios";
import { UserInfo } from "../../service/AuthServiceProvider";

function login(props: any) {
    const {email, password, context} = props;
    const { authenticateUser, setError } = context;

    axios
        .post(
            "http://localhost:8000/login",
            {
                email,
                password,
            },
            {
                withCredentials: true,
            }
        )
        .then((res: AxiosResponse<UserInfo>) => {
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
        .post("http://localhost:8000/signup", {
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
