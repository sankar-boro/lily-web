import { useBookContext } from "lily-service";
import { createSubSection } from "lily-utils";

import { BookContextType, Section, SubSection } from "lily-types";
import { DividerContainer } from "lily-web/components";
import { useHistory } from "react-router-dom";


const Divider = () => {
    const context: BookContextType = useBookContext();
    const history = useHistory();

    const { activePage: section } = context;
    if (!section) return null;
    const { identity, child: subSections } = section as Section;

    const goBack = (e: any) => {
        e.preventDefault();
        history.goBack();
    }

    return <DividerContainer>
        <div className="divider-settings">
            <div className="hover settings-item" onClick={goBack}>&#x2190;</div>
        </div>
    </DividerContainer>
}

export default Divider;
