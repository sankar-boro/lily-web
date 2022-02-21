import { createSubSection, useBookContext } from "lily-service";
import { BookContextType, Section, SubSection } from "lily-types";
import { DividerContainer } from "lily-web/components";

const Divider = () => {
    const context: BookContextType = useBookContext();
    const { activePage: section } = context;
    if (!section) return null;
    const { identity, child: subSections } = section as Section;
    if (identity < 105) return <DividerContainer />;

    return <DividerContainer>
        <div className="li-item hover">Delete</div>
        <div 
            className="add-item li-item hover"
            onClick={() => createSubSection(context, undefined)}
        >
            + Sub-section
        </div>
        {identity === 105 && subSections.map((subSection: SubSection) => {
            return <div key={subSection.uniqueId}>
                {subSection.title}
                <div 
                    className="add-item li-item hover"
                    onClick={() => createSubSection(context, subSection)}
                >
                    + Sub-section
                </div>
            </div>;
        })}
    </DividerContainer>
}

export default Divider;
