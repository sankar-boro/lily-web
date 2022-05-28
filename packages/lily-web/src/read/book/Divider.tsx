import { useHistory } from "react-router-dom";
import { useAuthContext, useBookContext } from "lily-service";
import { BookContextType, Section, SubSection } from "lily-types";
import { DividerContainer } from "../../components"

const AuthUserSettings = (props: any) => {
    const { authUserData, onClickEdit} = props;
    if (authUserData) {
        return <div className="hover settings-item brd-left" onClick={onClickEdit}>Edit</div>
    }
    return null;
}

const Divider = () => {
    const history = useHistory();
    const { bookId, activePage }: BookContextType = useBookContext();
    const { authUserData } = useAuthContext();
    if (!activePage) return <DividerContainer />;
    const section = activePage as Section;
    const { identity, child: subSections } = section;

    const onClickEdit = () => {
        history.push({
            pathname: `/book/edit/${bookId}`,
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
        </div>
        <div className="divider-content">
            {identity === 105 && subSections.map((x: SubSection, subSectionIndex: number) => {
                return <div className="li-item hover" key={subSectionIndex}>
                    <a href={`#${x.uniqueId}`}>    
                        {x.title}
                    </a>
                </div>;
            })}
        </div>
    </DividerContainer>
}

export default Divider;