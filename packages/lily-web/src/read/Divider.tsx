import { useHistory } from "react-router-dom";
import { useBookContext } from "lily-service";
import { BookContextType, Section, SubSection } from "lily-types";
import { DividerContainer } from "../components"

const Divider = () => {
    const history = useHistory();
    const { bookId, activePage }: BookContextType = useBookContext();
    if (!activePage) return <DividerContainer />;
    const section = activePage as Section;
    const { identity, child: subSections } = section;

    const editNavigate = (e: any) => {
        e.preventDefault();
        history.push({
            pathname: `/book/edit/${bookId}`,
            state: history.location.state,
        });
    }
    return <DividerContainer>
        <div className="li-item hover" onClick={editNavigate}>Edit</div>
        <div className="li-item hover">Delete</div>
        <div>
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