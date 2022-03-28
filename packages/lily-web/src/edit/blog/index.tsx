import { useEffect } from "react";
import BodyComponent from "./BodyComponent";
import { createNewBlogForm } from 'lily-utils';
import NavigationComponent from "./NavigationComponent";
import { BlogContextType, VUE } from "lily-types";
import { useBlogContext, BlogServiceProvider } from 'lily-service';
import { BlogHandler } from "lily-service/BlogService";
import { DeleteComponent } from "./ModalComponents";
import { BodyContainer, MainContainer, NavigationContainer } from "lily-web/components";
import Divider from "./Divider";

const RenderModal = () => {
    const { modal }: BlogContextType = useBlogContext();
    if (modal) {
        return <div className="modal">
            <div className="modal-container">
                <div className="modal-body">
                    <DeleteComponent />
                </div>
            </div>
        </div>
    }
    return null;
}

export const RenderComponent = () => {
    return <MainContainer>
        <NavigationContainer>
            <NavigationComponent />
        </NavigationContainer>
        <BodyContainer>
            <RenderModal />
            <BodyComponent />  
        </BodyContainer>
        <Divider />
    </MainContainer>  
}

const getBlogData = (blogId: string | null, context: any) => {
    const { dispatch } = context;
    if (blogId) {
        const service = new BlogHandler();
        service.fetch(blogId)
        .then((res) => res.map_res())
        .then((res) => {
            const { rawData, apiData } = res;
            if (rawData && apiData) {
                dispatch({
                    keys: ['rawData', 'apiData', 'blogId', 'vue'],
                    values: [rawData, apiData, blogId, VUE.DOCUMENT]
                })
            } else {
                dispatch({
                    keys: ['vue'],
                    values: [VUE.NONE]
                })
            }
        })
    }

    if (!blogId) {
        createNewBlogForm(context);
    }
}

const Main = () => {
    const context: BlogContextType = useBlogContext();
    const { blogId }: BlogContextType = context;

    useEffect(() => {getBlogData(blogId, context)}, [blogId]);

    return <RenderComponent />;
}

export default function EditComponent(){
    return <BlogServiceProvider>
        <Main />
    </BlogServiceProvider>
}