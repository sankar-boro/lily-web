import { useEffect } from "react";
import Card from "./Card";
import { useHomeContext, useAuthContext } from "lily-service";
import { HOME_SERVICE, AUTH_SERVICE } from "lily-types";

const Home = () => {
    const { books, dispatch } = useHomeContext();
    const { dispatch: authDispatch } = useAuthContext();
    useEffect(() => { 
        if (!localStorage.getItem('auth')) {
            authDispatch({
                type: AUTH_SERVICE.SETTERS,
                setters: {
                    keys: ['auth', 'authUserData'],
                    values: ['false', null]
                }
            })
        }   
        dispatch({
            type: HOME_SERVICE.SETTERS,
            setters: {
                keys: ['title'],
                values: [null]
            }
        })
    }, []);

    return (
        <div className="container-sm flex">
            {books
                .filter((a: any) => a.identity === 101)
                .map((data: any) => {
                    return <Card data={data} key={data.uniqueId} />;
                })}
        </div>
    );
};

export default Home;
