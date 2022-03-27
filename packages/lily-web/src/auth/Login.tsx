import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "lily-service";
import { AUTH_SERVICE } from "lily-types";
import { LOGIN, postQuery } from 'lily-query';

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

function login(userInfo: any) {
    return new Promise((resolve, reject) => {
        postQuery({ url: LOGIN, data: userInfo})
        .then((res: any) => {
            if (res && res.data) {
                resolve({
                    type: 'SUCCESS',
                    data: res.data,
                });
            }
        })
        .catch((err: any) => {
            let _err = JSON.parse(JSON.stringify(err));
            reject({
                type: 'ERROR',
                data: _err,
            })
        })
    })
};

//
const Login = () => {
    const { dispatch } = useAuthContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const loginDispatch = (e: any) => {
        e.preventDefault();
        login({
            email, 
            password
        }).then((res: any) => {
            console.log('res', res);
            if (res.type === 'SUCCESS') {
                localStorage.setItem('auth', res.data);
                dispatch({
                    keys: ['auth', 'authUserData'],
                    values: ['true', res.data]
                })
            }
        }).catch((err) => {
            setError(err.data.message);
        })
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
                                    onClick={loginDispatch}
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
