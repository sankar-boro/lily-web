import { BOOK_SERVICE, FORM_TYPE } from 'lily-types';

export const createSubSection = (props: any) => {
    const { context, subSectionIndex, activePage, subSection } = props;
    const { viewData } = context;
    const subSections = activePage.child;
    const { dispatch } = context;
    const sectionId = viewData.uniqueId;

    if (subSections.length === 0) {
        const viewType = FORM_TYPE.SUB_SECTION;
        const formData = {
            parentId: sectionId,
            identity: 106,
        }
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['viewType', 'formData'],
                values: [viewType, formData]
            }
        })
        return;
    }


    if (subSections.length > 0 && subSection === null) {
        let topUniqueId = sectionId;
        let botUniqueId = subSections[0].uniqueId;
        const viewType = FORM_TYPE.CREATE_UPDATE;
        const formData = {                        
            topUniqueId,
            botUniqueId,
            identity: 106,
        }
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['viewType', 'formData'],
                values: [viewType, formData]
            }
        })
        return;
    }

    const subSectionsLength = subSections.length - 1;

    if (subSection && subSectionIndex < subSectionsLength) {
        let topUniqueId = subSections[subSectionIndex].uniqueId;
        let botUniqueId = subSections[subSectionIndex+1].uniqueId;
        const viewType = FORM_TYPE.CREATE_UPDATE;
        const formData = {
            topUniqueId,
            botUniqueId,
            identity: 106,
        }
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['viewType', 'formData'],
                values: [viewType, formData]
            }
        })
        return;
    }

    if (subSection && subSectionIndex === subSectionsLength) {
        let topUniqueId = subSections[subSectionIndex].uniqueId;
        const viewType = FORM_TYPE.SUB_SECTION;
        const formData = {                        
            parentId: topUniqueId,
            identity: 106,
        }
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['viewType', 'formData'],
                values: [viewType, formData]
            }
        })
    }
}