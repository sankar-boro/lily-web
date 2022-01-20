import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { signup } from "./util";

const Login = () => {
    const [email, setEmail] = useState("sankar.boro@yahoo.com");
    const [password, setPassword] = useState("sankar");
    const [fname, setFname] = useState("Sankar");
    const [lname, setLname] = useState("boro");
    const history = useHistory();

    //
    return (
        <div className="container container-center">
            <div className="container-login">
                <div className="h1">Sign up</div>
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
                                    onClick={(e) => {
                                        e.preventDefault();
                                        signup({
                                            email,
                                            password,
                                            fname,
                                            lname,
                                            history,
                                        });
                                    }}
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

export default Login;
