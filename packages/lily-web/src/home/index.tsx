import { Switch, Route } from "react-router-dom";
import Header from "./Header";
import ViewBook from "../read/book";
import ViewBlog from "../read/blog";
import Profile from "../profile";
import EditBlog from "../edit/blog";
import EditBook from "../edit/book";
import Home from "./Home";
import { HomeServiceProvider } from "lily-service";

const Main = () => {
    return (
        <HomeServiceProvider>
            <div className="home">
                <Header />
                <div className="body">
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
                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
                </div>
            </div>
        </HomeServiceProvider>
    );
};

export default Main;
