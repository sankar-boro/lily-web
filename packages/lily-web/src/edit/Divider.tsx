import { useBookContext } from "lily-service";
import { BookContextType, BOOK_SERVICE, Section, VUE, ActivePage, SubSection, NODE_TYPE } from "lily-types";
import { DividerContainer } from "lily-web/components";

const Divider = () => {
    const context: BookContextType = useBookContext();
    const { activePage: section, dispatch, dispatcher } = context;
    if (!section) return null;
    const { identity, child: subSections, uniqueId } = section as Section;    
    
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
            dispatcher?.setKeyVal('vue', {
                type: VUE.FORM,
                form: {
                    type: NODE_TYPE.SUB_SECTION,
                    method: 'CREATE',
                    url: '',
                    data: formData
                },
                document: {}
            });
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
            dispatcher?.setKeyVal('vue', {
                type: VUE.FORM,
                form: {
                    type: NODE_TYPE.SUB_SECTION,
                    method: 'CREATE',
                    url: '',
                    data: formData
                },
                document: {}
            });
            // __create(dispatch, formData)
        }
    };

    return <DividerContainer>
        <div className="li-item hover">Delete</div>
        <div 
            className="add-item li-item hover"
            onClick={() => {__click.outer()}}
        >
            + Sub-section
        </div>
        {identity === 105 && subSections.map((subSection: SubSection) => {
            return <div key={subSection.uniqueId}>
                {subSection.title}
                <div 
                    className="add-item li-item hover"
                    onClick={() => {__click.inner(subSection)}}
                >
                    + Sub-section
                </div>
            </div>;
        })}
    </DividerContainer>
}

export default Divider;
