import { FORM_TYPE } from "../../../../globals/types";

const createSubSection = (props: any) => {
    console.log('createSubSection', props);
    const { context, subSectionIndex, activePage, subSection } = props;
    const { viewData } = context;
    const subSections = activePage.child;
    const { dispatch } = context;
    const sectionId = viewData.uniqueId;

    if (subSections.length === 0) {
        dispatch({
            type: 'FORM_PAGE_SETTER',
            viewType: FORM_TYPE.SUB_SECTION,
            payload: {
                parentId: sectionId,
                identity: 106,
            }
        });
        return;
    }


    if (subSections.length > 0 && subSection === null) {
        let topUniqueId = sectionId;
        let botUniqueId = subSections[0].uniqueId;
        dispatch({
            type: 'FORM_PAGE_SETTER',
            payload: {
                topUniqueId,
                botUniqueId,
                identity: 106,
            },
            viewType: FORM_TYPE.CREATE_UPDATE,
        });
        return;
    }

    const subSectionsLength = subSections.length - 1;

    if (subSection && subSectionIndex < subSectionsLength) {
        let topUniqueId = subSections[subSectionIndex].uniqueId;
        let botUniqueId = subSections[subSectionIndex+1].uniqueId;
        dispatch({
            type: 'FORM_PAGE_SETTER',
            payload: {
                topUniqueId,
                botUniqueId,
                identity: 106,
            },
            viewType: FORM_TYPE.CREATE_UPDATE,
        });
        return;
    }

    if (subSection && subSectionIndex === subSectionsLength) {
        let topUniqueId = subSections[subSectionIndex].uniqueId;
        dispatch({
            type: 'FORM_PAGE_SETTER',
            viewType: FORM_TYPE.SUB_SECTION,
            payload: {
                parentId: topUniqueId,
                identity: 106,
            },
        });
    }
}

export {
    createSubSection
}