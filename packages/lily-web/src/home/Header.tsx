import { Link } from "react-router-dom";
import { useAuthContext, useHomeContext } from "lily-service";
import { LOGOUT, postQuery } from "lily-query";
import { useState } from "react";
import searchSvg from './search.svg';

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

const userInfo = (authUserData: any) => {
    if (!authUserData) return {
        routeName: "/login",
        routeValue: "Login"
    };
    if (authUserData) {
        return {
            routeName: "/profile",
            routeValue: `${authUserData?.fname} ${authUserData?.lname}`
        }
    }
    return {
        routeName: "",
        routeValue: ""
    }
}

const LoginComponent = (props: any) => {
    const { authUserData, callBack } = props;
    if (!authUserData) {
        return null;
    }
    if (authUserData) {
        return (
            <div className="nav-section">
                <div
                    className="link hover"
                    onClick={() => {logout(callBack)}}
                >
                    Logout
                </div>
            </div>
        );
    }
    return null;
}

const Header = () => {
    const { title, vue } = useHomeContext();
    const { authUserData, dispatch } = useAuthContext();
    const { routeName, routeValue } = userInfo(authUserData);
    const [ search, setSearch ] = useState('');
    
    if (vue.isRead) return null;

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
                <div className="nav-section hover">
                    <img src={searchSvg} alt="search icon" className="search__icon" />
                    <input 
                        type="text" 
                        name="search"
                        className="search__input"
                        value={search} 
                        placeholder="Search"
                        onChange={(e) => {
                            e.preventDefault();
                            setSearch(e.target.value);
                        }}
                    />
                </div>
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
                    <Link to={routeName} className="link">
                        {routeValue}
                    </Link>
                </div>
                <LoginComponent authUserData={authUserData} callBack={cleanUpUi} />
            </div>
        </div>
    );
};

export default Header;