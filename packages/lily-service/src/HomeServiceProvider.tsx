import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";

export type HomeState = {
    books: Node[]
};

const homeState = {
    books: [],
}

export const HomeContext = React.createContext<HomeState>({
    books: [],
});

export const useHomeContext = () => useContext(HomeContext);

export const HomeServiceProvider = (props: { children: object }) => {
    const [books, setBooks] = useState<any>(null);
    
    useEffect(() => {
        axios
        .get("http://localhost:8000/book/all", {
            withCredentials: true,
        })
        .then((res: any) => {
            if (
                res.status &&
                typeof res.status === "number" &&
                res.status === 200
            ) {
                setBooks(res.data)
            }
        });
    },[]);

    if (!books) return null;

    return (
        <HomeContext.Provider
            value={{
                books,
            }}
        >
            {props.children}
        </HomeContext.Provider>
    );
};
