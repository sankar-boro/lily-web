import { useBookContext } from "lily-service";
import { BookContextType, BOOK_SERVICE, VUE, Section } from "lily-types";
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

const AddSubSectionOuter = (props: {
    activePage: any,
}) => {
    const { dispatch } = useBookContext();
    const { activePage: section } = props;
    const { uniqueId } = section;
    const { identity, child: subSections } = section;
    if (identity < 105) return null;
    
    const topUniqueId = uniqueId;
    let botUniqueId: any = subSections && subSections[0] && subSections[0].uniqueId;
    const formData = {
        topUniqueId,
        botUniqueId,
        identity: 106,
        type: 'create_new_node'
    }
    const click = () => __create(dispatch, formData);

    return (
        <div 
            className="li-item hover" 
            onClick={click}
        >
            + Sub-section
        </div>
    )
}

const AddSubSectionInner = (props: {
    subSection: any,
    activePage: any,
    dispatch: any
}) => {
    const { activePage: section, subSection, dispatch } = props;
    const { identity, child: subSections } = section;
    
    if (identity < 105) return null;
    
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
        type: 'create_new_node'
    }
    
    const click = () => __create(dispatch, formData);
    
    return (
        <div 
            className="li-item hover"
            onClick={click}
        >
            + Sub-section
        </div>
    )
}

const Divider = () => {
    const { dispatch, activePage, formData }: BookContextType = useBookContext();
    const props = { activePage, dispatch, subSection: null };
    if (!formData) return <DividerContainer />;
    if (!activePage) return <DividerContainer />;
    const section = activePage as Section;
    const { identity, child: subSections } = section;

    return <DividerContainer>
         <div className="li-item hover">Delete</div>
         <AddSubSectionOuter { ...props } />
         {identity === 105 && subSections.map((subSection: any, subSectionIndex: number) => {
             return <div key={subSection.uniqueId}>
                 {subSection.title}
                 <AddSubSectionInner 
                     { ...props }
                     subSection={subSection}
                     key={subSectionIndex}
                 />
             </div>;
        })}
    </DividerContainer>
}

export default Divider;
