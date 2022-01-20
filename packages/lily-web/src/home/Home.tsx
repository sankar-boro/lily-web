import { useEffect } from "react";
import Card from "./Card";
import { useHomeContext, useAuthContext, HomeServiceProvider } from "lily-service";

const Main = () => {
    const authContext = useAuthContext();
    const { books } = useHomeContext();

    useEffect(() => {
        authContext.setRead(false);
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

}

const Home = () => {
    return <HomeServiceProvider>
        <Main />
    </HomeServiceProvider>
};

export default Home;
