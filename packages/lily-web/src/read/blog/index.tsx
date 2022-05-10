import BodyComponent from "./BodyComponent";
import NavigationComponent from "./NavigationComponent";
import { BlogServiceProvider, FormServiceProvider } from "lily-service";
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

const Main = () => {
    return <RenderComponent />;
}

export default function ReadComponent(){
    return <BlogServiceProvider>
        <FormServiceProvider>
            <Main />
        </FormServiceProvider>
    </BlogServiceProvider>
}