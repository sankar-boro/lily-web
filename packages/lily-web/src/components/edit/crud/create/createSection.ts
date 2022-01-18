import { FORM_TYPE } from "../../../../globals/types";

const createSection = (
    props: any,
) => {
    console.log(props);
    const { sectionIndex, page, context } = props;
    let sections = page.child;
    let totalSections = sections.length;
    const { dispatch } = context;
    let formType = "";
    let parentId = "";
    let identity = 105;
    let topUniqueId = "";
    let botUniqueId = "";

    if (sectionIndex === undefined || sectionIndex === null) {
        if (totalSections === 0) {
            formType = "newSection";
            parentId = page.uniqueId;
        } else if (totalSections > 0) {
            formType = "createUpdate";
            topUniqueId = page.uniqueId;
            botUniqueId = sections[0].uniqueId;
        }
    }

    if (sectionIndex !== undefined && typeof sectionIndex === "number") {
        const lastSectionIndex = totalSections - 1;
        if (sectionIndex === lastSectionIndex) {
            formType = "newSection";
            parentId = sections[sectionIndex].uniqueId;
        } else if (sectionIndex !== lastSectionIndex) {
            formType = "createUpdate";
            topUniqueId = sections[sectionIndex].uniqueId;
            botUniqueId = sections[sectionIndex + 1].uniqueId;
        }
    }

    if (formType === "newSection") {
        dispatch({
            type: 'FORM_PAGE_SETTER',
            payload: {
                parentId,
                identity,
            },
            viewType: FORM_TYPE.SECTION,
        });
        return;
    }

    if (formType === "createUpdate") {
        dispatch({
            type: 'FORM_PAGE_SETTER',
            payload: {
                topUniqueId,
                botUniqueId,
                identity,
            },
            viewType: FORM_TYPE.CREATE_UPDATE,
        });
        return;
    }

};

export {
    createSection
}