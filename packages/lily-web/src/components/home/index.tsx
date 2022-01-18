import { Switch, Route } from "react-router-dom";
import Header from "./Header";
import ViewBook from "../read";
import Profile from "../profile";
import NewBook from "../create";
import NewBlog from "../forms/blog";
import EditBook from "../edit/index";
import Home from "./Home";

const Main = () => {
    return (
        <div className="home">
            <Header />
            <div className="body">
                <Switch>
                    <Route path="/book/view/:bookId">
                        <ViewBook />
                    </Route>
                    <Route path="/profile">
                        <Profile />
                    </Route>
                    <Route path="/new/book">
                        <NewBook />
                    </Route>
                    <Route path="/new/blog">
                        <NewBlog />
                    </Route>
                    <Route path="/book/edit/:bookId">
                        <EditBook />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </div>
        </div>
    );
};

export default Main;
