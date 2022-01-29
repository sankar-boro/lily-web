import BodyRenderer from "./BodyRenderer";
import NavigationRenderer from "./NavigationRenderer";
import { BookServiceProvider } from 'lily-service';
import { useEffect } from "react";

export default function Main(){
    return <BookServiceProvider>
        <NavigationRenderer />
        <BodyRenderer />
    </BookServiceProvider>
}