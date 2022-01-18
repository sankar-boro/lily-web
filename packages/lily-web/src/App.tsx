import React from "react";
import AppRoute from "./route";
import { Hello } from "lily-components";

const App = () => {
    console.log(Hello().val);
    return <AppRoute />;
};

export default App;
