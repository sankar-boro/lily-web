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
    console.log(auth);
    if (auth === 'loading') return <div>Loding...</div>;
    if (auth === 'false') return <NotAuthRoute />;
    if (auth === 'true') return <AuthRoute />;
    return null;
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
