import { useEffect } from "react";
import Card from "./Card";
import { useHomeContext, useAuthContext, HomeServiceProvider } from "lily-service";
import { HOME_SERVICE } from "lily-types";

const Home = () => {
    const authContext = useAuthContext();
    const { books, dispatch } = useHomeContext();

    useEffect(() => {
        authContext.setRead(false);
        dispatch({
            type: HOME_SERVICE.SETTERSV1,
            settersv1: {
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
