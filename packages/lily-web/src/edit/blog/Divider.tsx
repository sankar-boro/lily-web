import { DividerContainer } from "lily-web/components";
import { useHistory } from "react-router-dom";


const Divider = () => {
    const history = useHistory();

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
