import { useHistory } from "react-router-dom";
import { useBlogContext } from "lily-service";
import { BlogContextType } from "lily-types";
import { DividerContainer } from "../../components"

const Divider = () => {
    const history = useHistory();
    const { blogId }: BlogContextType = useBlogContext();

    const onClickEdit = () => {
        history.push({
            pathname: `/blog/edit/${blogId}`,
            state: history.location.state,
        });
    }

    const onClickBack = (e: any) => {
        e.preventDefault();
        history.goBack();
    }

    return <DividerContainer>
        <div className="divider-settings">
            <div className="hover settings-item" onClick={onClickBack}>&#x2190;</div>
            <div className="hover settings-item brd-left" onClick={onClickEdit}>Edit</div>
        </div>
    </DividerContainer>
}

export default Divider;