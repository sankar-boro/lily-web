import { useHistory } from "react-router-dom";
import { useBookContext } from "lily-service";
import { BookContextType, Section, SubSection } from "lily-types";
import { DividerContainer } from "../../components"

const Divider = () => {
    const history = useHistory();
    const { bookId, activePage }: BookContextType = useBookContext();
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
            <div className="hover settings-item brd-left" onClick={onClickEdit}>Edit</div>
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