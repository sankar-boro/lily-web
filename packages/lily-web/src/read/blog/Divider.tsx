import { useHistory } from "react-router-dom";
import { useAuthContext, useBlogContext, useHomeContext } from "lily-service";
import { BlogContextType, HomeContextType } from "lily-types";
import { DividerContainer } from "../../components"

const AuthUserSettings = (props: any) => {
    const { authUserData, onClickEdit} = props;
    if (authUserData) {
        return <div className="hover settings-item brd-left" onClick={onClickEdit}>Edit</div>
    }
    return null;
}

const contextHandler = (context: HomeContextType) => {
    const { dispatch, vue } = context;
    return {
        onClickRead: () => {
            dispatch({
                keys: ['vue'],
                values: [{isRead: !vue.isRead}]
            })
        }
    }
}

const Divider = () => {
    const history = useHistory();
    const { blogId }: BlogContextType = useBlogContext();
    const { authUserData } = useAuthContext();
    const { onClickRead } = contextHandler(useHomeContext());

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
            <AuthUserSettings onClickEdit={onClickEdit} authUserData={authUserData} />
            <div className="hover settings-item" onClick={onClickRead}>Read</div>
        </div>
    </DividerContainer>
}

export default Divider;