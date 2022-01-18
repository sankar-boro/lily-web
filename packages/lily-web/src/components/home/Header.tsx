import { Link } from "react-router-dom";
import { logout } from "./util";
import { useAuthContext } from "../../service/AuthServiceProvider";

const Header = () => {
    const context = useAuthContext();
    const read = context.read;
    const userData = context.authUserData;
    let userInfo = null;
    if (context.auth) {
        userInfo = userData.unwrap();
    }

    if (read) return null;
    
    return (
        <div>
            <div className="navbar navbar-top">
                <div className="navbar-top-left">
                    <div className="nav-section">
                        <Link to="/" className="link hover">
                            Lily
                        </Link>
                    </div>
                    <div className="nav-section hover">Search</div>
                </div>
                <div className="navbar-top-center"></div>
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
                            {userInfo?.fname} {userInfo?.lname}
                        </Link>
                    </div>
                    <div className="nav-section">
                        <div
                            className="link hover"
                            onClick={(e: any) => logout(e, context)}
                        >
                            Logout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;