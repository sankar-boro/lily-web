import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./home";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { useAuthContext, AuthServiceProvider } from "lily-service";

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
    const { auth } = context;
    if (auth === null) return <div>Loding...</div>;
    if (auth === false) return <NotAuthRoute />;
    return <AuthRoute />;
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
