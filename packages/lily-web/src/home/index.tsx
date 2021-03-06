import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Header from "./Header";
import ViewBook from "../read/book";
import ViewBlog from "../read/blog";
import Profile from "../profile";
import EditBlog from "../edit/blog";
import EditBook from "../edit/book";
import Home from "./Home";
import { HomeServiceProvider, useAuthContext, HomeContext } from "lily-service";
import Login from "../auth/Login";
import Signup from "../auth/Signup";

const Main = () => {
    const auth = useAuthContext();
    console.log(auth);
    return (
        <HomeServiceProvider>
            <HomeContext.Consumer>
            {({ vue }) => (
                <div className="home">
                    <Header />
                    <div className="body" style={{ marginTop: vue.isRead ? 0 : 36 }}>
                        <Switch>
                            <Route path="/book/view/:bookId">
                                <ViewBook />
                            </Route>
                            <Route path="/blog/view/:bookId">
                                <ViewBlog />
                            </Route>
                            <Route path="/profile">
                                <Profile />
                            </Route>
                            <Route path="/new/book">
                                <EditBook />
                            </Route>
                            <Route path="/new/blog">
                                <EditBlog />
                            </Route>
                            <Route path="/book/edit/:bookId">
                                <EditBook />
                            </Route>
                            <Route path="/blog/edit/:blogId">
                                <EditBlog />
                            </Route>
                            <Route path="/signup">
                                <Signup />
                            </Route>
                            <Route path="/login">
                                <Login />
                            </Route>
                            <Route path="/">
                                <Home />
                            </Route>
                        </Switch>
                    </div>
                </div>
            )}
            </HomeContext.Consumer>
        </HomeServiceProvider>
    );
};

export default Main;
