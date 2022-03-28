import { useEffect, useState } from "react";
import BodyComponent from "./BodyComponent";
import NavigationComponent from "./NavigationComponent";
import { BlogHandler } from "lily-service/BlogService";
import { useBlogContext, BlogServiceProvider, FormServiceProvider, useHomeContext, useAuthContext } from "lily-service";
import {  updatePage } from "lily-utils";
import { AUTH_SERVICE, BlogContextType, BOOK_SERVICE, HOME_SERVICE, VUE } from "lily-types";
import { BodyContainer, MainContainer, NavigationContainer } from "lily-web/components";
import Divider from "./Divider";

const RenderComponent = () => {
    return <MainContainer>
        <NavigationContainer>
            <NavigationComponent />
        </NavigationContainer>
        <BodyContainer>
            <BodyComponent />  
        </BodyContainer>
        <Divider />
    </MainContainer>
}

const useBlogFetch = (blogId: string | null) => {
    const [data, setData] = useState<any>(null);
    const [err, setErr] = useState(false);
    useEffect(() => {
        if (!blogId) return;
        const service = new BlogHandler();
        service.fetch(blogId)
        .then((res) => res.map_res())
        .then((res) => {
            const { rawData, apiData } = res;
            setData({
                rawData, apiData
            })
        })
        .catch((err: any) => {
            setErr(true);
            console.log(JSON.parse(JSON.stringify(err)))
        })
    }, [blogId]);
    return [data, err];
}

const Main = () => {
    const context: BlogContextType = useBlogContext();
    const { vue, blogId, notifications, dispatcher } = context;
    const [blogData, err] = useBlogFetch(blogId);
    const { dispatch: homeDispatch } = useHomeContext();
    const { dispatch: authDispatch } = useAuthContext();
    useEffect(() => {
        console.log(err)
        if (err) {
            console.log('authErr')
            authDispatch({
                keys: ['auth', 'authUserData'],
                values: ['false', null]
            })
        }
        if (!blogData) return;
        dispatcher?.setFrom(blogData);
        dispatcher?.setFrom({
            blogId,
            vue: VUE.DOCUMENT
        })
        homeDispatch({
            keys: ['title'],
            values: [blogData?.activePage?.title]
        })
    }, [blogData, err]);

    useEffect(() => {
        updatePage(context);
    }, [notifications]);

    if (vue.viewType === VUE.NONE) return null;
    if (!blogId) return null;
    return <RenderComponent />;
}

export default function ReadComponent(){
    return <BlogServiceProvider>
        <FormServiceProvider>
            <Main />
        </FormServiceProvider>
    </BlogServiceProvider>
}