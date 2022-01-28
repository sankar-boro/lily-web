import { BOOK_SERVICE, FORM_TYPE } from 'lily-types';

export const createSubSection = (props: any) => {
    const { context, subSectionIndex, activePage, subSection } = props;
    const { viewData } = context;
    const subSections = activePage.child;
    const { dispatch } = context;
    const sectionId = viewData.uniqueId;

    if (subSections.length === 0) {
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: [
                {
                    key: 'viewType',
                    value: FORM_TYPE.SUB_SECTION
                },
                {
                    key: 'formData',
                    value: {
                        parentId: sectionId,
                        identity: 106,
                    }
                }
            ]
        })
        return;
    }


    if (subSections.length > 0 && subSection === null) {
        let topUniqueId = sectionId;
        let botUniqueId = subSections[0].uniqueId;
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: [
                {
                    key: 'viewType',
                    value: FORM_TYPE.CREATE_UPDATE
                },
                {
                    key: 'formData',
                    value: {                        
                        topUniqueId,
                        botUniqueId,
                        identity: 106,
                    }
                }
            ]
        })
        return;
    }

    const subSectionsLength = subSections.length - 1;

    if (subSection && subSectionIndex < subSectionsLength) {
        let topUniqueId = subSections[subSectionIndex].uniqueId;
        let botUniqueId = subSections[subSectionIndex+1].uniqueId;
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: [
                {
                    key: 'viewType',
                    value: FORM_TYPE.CREATE_UPDATE
                },
                {
                    key: 'formData',
                    value: {                        
                        topUniqueId,
                        botUniqueId,
                        identity: 106,
                    }
                }
            ]
        })
        return;
    }

    if (subSection && subSectionIndex === subSectionsLength) {
        let topUniqueId = subSections[subSectionIndex].uniqueId;
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: [
                {
                    key: 'viewType',
                    value: FORM_TYPE.SUB_SECTION
                },
                {
                    key: 'formData',
                    value: {                        
                        parentId: topUniqueId,
                        identity: 106,
                    }
                }
            ]
        })
    }
}