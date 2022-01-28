import { useBookContext } from "lily-service";
import { BOOK_SERVICE, VUE } from "lily-types";

const createSubSection = (dispatch: any, formData: any) => {
    dispatch({
        type: BOOK_SERVICE.SETTERS,
        setters: [
            {
                key: 'vue',
                value: VUE.FORM
            },
            {
                key: 'formData',
                value: formData,
            }
        ]
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
    }
    const click = () => createSubSection(dispatch, formData);

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
        identity: 106
    }
    
    const click = () => createSubSection(dispatch, formData);
    
    return (
        <div 
            className="li-item hover"
            onClick={click}
        >
            + Sub-section
        </div>
    )
}

const Divider = (props: any) => {
    const { activePage } = props;
    const { identity } = activePage;
    const { dispatch } = useBookContext();
    const newProps = { ...props, dispatch, subSection: null };

    return <div className="con-20">
        <div className="li-item hover">Delete</div>
        <AddSubSectionOuter {...newProps } />
        {identity === 105 && activePage.child.map((subSection: any, subSectionIndex: number) => {
            return <div key={subSection.uniqueId}>
                {subSection.title}
                <AddSubSectionInner 
                    {...newProps}
                    subSection={subSection}
                />
            </div>;
        })}
    </div>
}

export default Divider;
