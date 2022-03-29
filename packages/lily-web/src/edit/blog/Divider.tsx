import { useBlogContext } from "lily-service";

import { BlogContextType } from "lily-types";
import { Delete } from "lily-utils";
import { DividerContainer } from "lily-web/components";
import { useHistory } from "react-router-dom";


const Divider = () => {
    const context: BlogContextType = useBlogContext();
    const history = useHistory();

    const { blogId } = context;

    const goBack = (e: any) => {
        e.preventDefault();
        history.goBack();
    }

    const deleteBlog = async () => {
    }

    return <DividerContainer>
        <div className="divider-settings">
            <div className="hover settings-item" onClick={goBack}>&#x2190;</div>
            <div className="hover settings-item" onClick={deleteBlog}>Delete</div>
        </div>
    </DividerContainer>
}

export default Divider;
