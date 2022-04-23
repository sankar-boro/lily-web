import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "lily-service";

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

const Login = () => {
    const { error, login } = useAuthContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const __login = (e: any) => {
        e.preventDefault();
        login({email, password})
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
                                    onClick={__login}
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
