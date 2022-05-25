import { DividerContainer } from "lily-web/components";
import { useHistory } from "react-router-dom";
import { DeleteBlog } from "lily-utils";
import { useBlogContext } from "lily-service";

const Divider = () => {
    const history = useHistory();
    const context = useBlogContext();
    const { blogId } = context;
    const goBack = (e: any) => {
        e.preventDefault();
        history.goBack();
    }

    const __delete = async () => {
        await DeleteBlog(
            context,
            { uniqueId: blogId, identity: 101 },
            history
        );
    }

    return <DividerContainer>
        <div className="divider-settings">
            <div className="hover settings-item" onClick={goBack}>&#x2190;</div>
            <div className="hover settings-item" onClick={__delete}>Delete</div>
        </div>
    </DividerContainer>
}

export default Divider;
