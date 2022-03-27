import { useEffect } from "react";
import BodyComponent from "./BodyComponent";
import NavigationComponent from "./NavigationComponent";
import { BlogContextType, VUE } from "lily-types";
import { useBlogContext, BlogServiceProvider } from 'lily-service';
import { updatePage } from 'lily-utils';
import { BlogHandler } from "lily-service/BlogService";
import { DeleteComponent } from "./ModalComponents";
import { BodyContainer, MainContainer, NavigationContainer } from "lily-web/components";
import Divider from "./Divider";

const Main = () => {
    const context: BlogContextType = useBlogContext();
    const { dispatch, notifications, vue, blogId }: BlogContextType = context;

    useEffect(() => {
        if (blogId) {
            const service = new BlogHandler();
            service.fetch(blogId)
            .then((res) => res.map_res())
            .then((res) => {
                const { rawData, apiData, activePage } = res;
                if (rawData && apiData && activePage) {
                    dispatch({
                        keys: ['rawData', 'apiData', 'activePage', 'blogId', 'vue'],
                        values: [rawData, apiData, activePage, blogId, VUE.DOCUMENT]
                    })
                } else {
                    dispatch({
                        keys: ['vue'],
                        values: [VUE.NONE]
                    })
                }
            })
            .catch((err) => {
                //
            });
        }
    }, [blogId]);

    useEffect(() => {
        updatePage(context);
    }, [notifications]);

    if (vue.viewType === VUE.NONE) return null;
    if (!blogId) return null;
    return <RenderComponent />;
}

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

export default Main;