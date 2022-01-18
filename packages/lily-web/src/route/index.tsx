import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "../components/home";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import AuthServiceProvider, {
    useAuthContext,
} from "../service/AuthServiceProvider";

//
const AuthRoute = () => {
    return (
        <Router>
            <Switch>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </Router>
    );
};

//
const NotAuthRoute = () => {
    return (
        <Router>
            <Switch>
                <Route path="/signup">
                    <Signup />
                </Route>
                <Route path="/">
                    <Login />
                </Route>
            </Switch>
        </Router>
    );
};

//
const CurrentComponents = () => {
    const context = useAuthContext();
    const { auth, initializing } = context;
    if (initializing) return <div>Loding...</div>;
    if (auth) return <AuthRoute />;
    return <NotAuthRoute />;
};

//
const AppRoute = () => {
    return (
        <AuthServiceProvider>
            <CurrentComponents />
        </AuthServiceProvider>
    );
};

//
export default AppRoute;
