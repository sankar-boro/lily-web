import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {SIGNUP, postQuery } from 'lily-query';
import { useAuthContext } from "lily-service";

function signup(userInfo: any, dispatch: any | undefined) {
    postQuery({ url: SIGNUP, data: userInfo})
    .then((res: any) => {
        if (res && res.data) {
            dispatch({
                type: 'SUCCESS',
                data: res.data,
            });
        }
    })
    .catch((err: any) => {
        dispatch({
            type: 'ERROR',
            data: err.response.data.message,
        })
    })
};

const Signup = () => {
    const { signup, error } = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');

    const __register = (e: any) => {
        e.preventDefault();
        const props = {
            email,
            password,
            fname,
            lname
        };
        signup(props);
    }
    return (
        <div className="container container-center">
            <div className="container-login">
                <div className="h1">Sign up</div>
                <div className="form-res-error">{error}</div>
                <div className="container-form">
                    <form action="#" method="post">
                        <div className="group-form-input">
                            <div className="form-section">
                                <div className="form-label">Email*</div>    
                                <input
                                    type="text"
                                    name="email"
                                    required
                                    className="form-input"
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setEmail(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="form-section">
                                <div className="form-label">First name*</div>
                                <input
                                    type="text"
                                    name="firstname"
                                    required
                                    className="form-input"
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setFname(e.target.value);
                                    }}
                                    />
                            </div>
                            <div className="form-section">
                                <div className="form-label">Last name*</div>
                                <input
                                    type="text"
                                    name="lastname"
                                    required
                                    className="form-input"
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setLname(e.target.value);
                                    }}
                                    />
                            </div>
                            <div className="form-section">
                                <div className="form-label">Password*</div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="form-input"
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setPassword(e.target.value);
                                    }}
                                    />
                            </div>
                        </div>
                        <div style={styles.footer}>
                            <div>
                                <button
                                    type="button"
                                    value="Submit"
                                    className="button button-relative button-secondary"
                                    onClick={__register}
                                    >
                                    Submit
                                </button>
                            </div>
                            <div>
                                <div>
                                    <Link to="/" className="link">Login</Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </ div>
    );
};

const styles = {
    footer: {display: "flex",justifyContent:"space-between", alignItems: "center"}
}

export default Signup;
