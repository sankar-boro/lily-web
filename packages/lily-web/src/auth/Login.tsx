import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "lily-service";
import { AUTH_SERVICE } from "lily-types";

const inputs = {
    email: {
        type: "text",
        name: "email",
        required: true,
    },
    password: {
        type: "password",
        name: "password",
        required: true,
    },
};

function login(userInfo: any, dispatch: any) {
    axios
        .post(
            "http://localhost:8000/login",
            userInfo,
            {
                withCredentials: true,
            }
        )
        .then((res: any) => {
            if (res && res.data) {
                dispatch({
                    type: 'SUCCESS',
                    data: res.data,
                });
            }
        })
        .catch((err: any) => {
            // if (err.response && err.response.data && err.response.data.message) {
            //     console.log(setError({credentials: err.response.data.message}));
            // }
            dispatch({
                type: 'ERR',
                data: err.response.data.message,
            })
        });
};

//
const Login = () => {
    const { dispatch } = useAuthContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const loginUser = (loginData: any) => {
        console.log(loginData);
        if (loginData.type === 'ERROR') {
            setError(loginData.data);
        }
        if (loginData.type === 'SUCCESS') {
            localStorage.setItem('auth', loginData.data);
            dispatch({
                type: AUTH_SERVICE.SETTERS,
                setters: {
                    keys: ['auth', 'authUserData'],
                    values: [true, loginData.data]
                }
            })
        }
    }
    return (
        <div className="container container-center">
            <div className="container-login">
                <div className="h1">Login</div>
                <div className="form-res-error">{error}</div>
                <div className="container-form">    
                    <form action="#" method="post">
                        <div className="group-form-input">
                            <div className="form-section">
                                <div className="form-label">Email*</div>
                                <input
                                    {...inputs.email}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setEmail(e.target.value);
                                    }}
                                    className="form-input"
                                    value={email}
                                    required
                                />
                            </div>
                            <div className="form-section">
                                <div className="form-label">Password*</div>
                                <input
                                    {...inputs.password}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setPassword(e.target.value);
                                    }}
                                    className="form-input"
                                    value={password}
                                    required
                                    />
                            </div>
                        </div>
                        <div style={{display: "flex",justifyContent:"space-between", alignItems: "center"}}>
                            <div>
                                <button
                                    type="submit"
                                    name="Submit"
                                    className="button"
                                    onClick={(e: any) => {
                                        e.preventDefault()
                                        login({email, password}, loginUser);
                                    }}
                                    >
                                    Submit
                                </button>
                            </div>
                            <div>
                                <div>
                                    <Link to="/signup" className="link">
                                        Sign up
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                                    
                </div>
            </div>
        </div>
    );
};

export default Login;
