import { Link } from "react-router-dom";
import { useAuthContext, useHomeContext } from "lily-service";
import { AUTH_SERVICE } from "lily-types";
import { LOGOUT, postQuery } from "lily-query";

type OnClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

const logout = (cleanUpLocalStorage: any) => {
    postQuery({ url: LOGOUT, data: {} })
    .then((res: any) => {
        if (
            res.status &&
            typeof res.status === "number" &&
            res.status === 200
        ) {
            cleanUpLocalStorage();
        }
    })
    .catch((err: any) => {
        // console.log("Logout Error", err.response);
    });
};

const Header = () => {
    const { title } = useHomeContext();
    const { authUserData, dispatch } = useAuthContext();

    const cleanUpUi = () => {
        localStorage.removeItem('auth');
        localStorage.clear();
        dispatch({
            keys: ['auth', 'authUserData'],
            values: ['false', null]
        })
    }
    return (
        <div className="navbar navbar-top">
            <div className="navbar-top-left">
                <div className="nav-section">
                    <Link to="/" className="link hover">
                        Lily
                    </Link>
                </div>
                <div className="nav-section hover">Search</div>
            </div>
            <div className="navbar-top-center" style={{ fontSize: "1.5em"}}>
                {title}
            </div>
            <div className="navbar-top-right">
                <div className="nav-section dropdown">
                    <div className="link hover">
                        Create
                        &#9662;
                    </div>
                    <div className="dropdown-content">
                        <Link to="/new/blog">Blog</Link>
                        <Link to="/new/book">Book</Link>
                    </div>
                </div>
                <div className="nav-section">
                    <Link to="/profile" className="link">
                        {authUserData?.fname} {authUserData?.lname}
                    </Link>
                </div>
                <div className="nav-section">
                    <div
                        className="link hover"
                        onClick={() => {logout(cleanUpUi)}}
                    >
                        Logout
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;