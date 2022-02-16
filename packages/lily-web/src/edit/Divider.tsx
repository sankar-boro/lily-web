import { useBookContext } from "lily-service";
import { BookContextType, BOOK_SERVICE, Section, VUE, ActivePage, SubSection } from "lily-types";
import { DividerContainer } from "lily-web/components";

const __create = (dispatch: any, formData: any) => {
    dispatch({
        type: BOOK_SERVICE.SETTERS,
        setters: {
            keys: ['vue', 'formData'],
            values: [VUE.FORM, formData]
        }
    })
}

const Divider = () => {
    const context: BookContextType = useBookContext();
    const { activePage: section, dispatch } = context;
    const { identity, child: subSections, uniqueId } = section as Section;    
    
    // Do not render if activePage is of type = Page | Common
    // Render if activePage is Section;
    if (identity === 104) return <DividerContainer />;

    const __click = {
        outer: () => {
            const topUniqueId = uniqueId;
            let botUniqueId: any = subSections && subSections[0] && subSections[0].uniqueId;
            const formData = {
                topUniqueId,
                botUniqueId,
                identity: 106,
                type: 'NEW_NODE'
            }
            __create(dispatch, formData)
        },
        inner: (subSection: SubSection) => {
            let topUniqueId = subSection.uniqueId;
            let botUniqueId: any = null;
            subSections.forEach((_subSection: any, index: number) => {
                if (_subSection.uniqueId === topUniqueId && subSections[index + 1]) {
                    botUniqueId = subSections[index + 1].uniqueId;
                }
            })
            const formData = {
                topUniqueId,
                botUniqueId,
                identity: 106,
                type: 'NEW_NODE'
            }
            __create(dispatch, formData)
        }
    };

    return <DividerContainer>
        <div className="li-item hover">Delete</div>
        <div 
            className="li-item hover"
            onClick={() => {__click.outer()}}
        >
            + Sub-section
        </div>
        {identity === 105 && subSections.map((subSection: SubSection) => {
            return <div key={subSection.uniqueId}>
                {subSection.title}
                <div 
                    className="li-item hover"
                    onClick={() => {__click.inner(subSection)}}
                >
                    + Sub-section
                </div>
            </div>;
        })}
    </DividerContainer>
}

export default Divider;
