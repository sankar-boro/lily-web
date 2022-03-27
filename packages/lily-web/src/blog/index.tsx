import { useEffect } from "react";
import { RenderComponent } from "./entry";
import { VUE, BlogContextType } from "lily-types";
import { useBlogContext } from 'lily-service';
import { createNewBlogForm } from 'lily-utils';
import { BlogServiceProvider } from "lily-service";

const Main = () => {
    const context: BlogContextType = useBlogContext();
    const { vue, blogId } = context;

    useEffect(() => {
        if (!blogId) {
            createNewBlogForm(context);
        }
    }, []);

    console.log(context);
    if (vue.viewType === VUE.NONE) return null;
    return <RenderComponent />
}

export default function CreateBookComponent(){
    return <BlogServiceProvider>
        <Main />
    </BlogServiceProvider>
}
