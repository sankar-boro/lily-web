import BodyComponent from "./BodyComponent";
import NavigationComponent from "./NavigationComponent";
import { BlogContextType } from "lily-types";
import { useBlogContext, BlogServiceProvider } from 'lily-service';
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

const Main = () => {
    return <RenderComponent />;
}

export default function EditComponent(){
    return <BlogServiceProvider>
        <Main />
    </BlogServiceProvider>
}