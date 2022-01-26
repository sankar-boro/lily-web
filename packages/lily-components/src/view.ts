import { BOOK_SERVICE, FORM_TYPE } from 'lily-types';

export const createChapter = (props: any) => {
    const { page, pageIndex, context } = props;
    const { apiData, dispatch } = context;
    if (!apiData && !apiData[pageIndex]) return;
    const lastPageIndex = apiData.length - 1;
    
    let _formData: any = {};
    let viewType: any = null;

    if (pageIndex === lastPageIndex) {
        _formData = {
            parentId: page.uniqueId,
            identity: 104
        };
        viewType = FORM_TYPE.CHAPTER
    } else {
        if (!apiData && !apiData[pageIndex]) return;
        const topUniqueId = apiData[pageIndex].uniqueId;
        const botUniqueId = apiData[pageIndex + 1].uniqueId;
        _formData = {
            topUniqueId,
            botUniqueId,
            identity: 104
        };
        viewType = FORM_TYPE.CREATE_UPDATE
    }

    dispatch({
        type: BOOK_SERVICE.SETTERS,
        setters: [
            {
                key: 'viewType',
                value: viewType
            },
            {
                key: 'formData',
                value: _formData
            }
        ]
    })
};

export const createSection = (
    props: any,
) => {
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
            type: BOOK_SERVICE.SETTERS,
            setters: [
                {
                    key: 'viewType',
                    value: FORM_TYPE.SECTION
                },
                {
                    key: 'formData',
                    value: {
                        parentId,
                        identity
                    }
                }
            ]
        })
        return;
    }

    if (formType === "createUpdate") {
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
                        identity,
                    }
                }
            ]
        })
        return;
    }

};

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