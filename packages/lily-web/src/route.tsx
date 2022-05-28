import { BrowserRouter as Router } from "react-router-dom";
import Home from "./home";
import { AuthServiceProvider } from "lily-service";

const AppRoute = () => {
    return (
        <Router>
            <AuthServiceProvider>
                <Home />
            </AuthServiceProvider>
        </Router>
    );
}

export default AppRoute;
