import { CREATE_NEW_BOOK, CREATE_UPDATE_ANY } from "lily-query";
import { setActivePageFn, sortAll } from "lily-service";
import { BookContextType, BOOK_SERVICE, NODE_TYPE, Section, Sections, VUE, vue, SubSection, Page } from "lily-types";

const __set = (dispatch: any, activePage: any) => {
    dispatch({
        type: BOOK_SERVICE.SETTERS,
        setters: {
            keys: ['vue', 'activePage'],
            values: [VUE.DOCUMENT, activePage]
        }
    })
}

const updateRawData = (context: BookContextType, newFormData: any, formResponse: any) => {
    const { rawData, bookId, activePage, dispatch } = context;
    if (!rawData || !activePage) return;
    const { res, cache } = formResponse;
    const { uniqueId } = formResponse.res.data;
    const { topUniqueId, botUniqueId, identity } = newFormData;
    const { title, body } = cache;
    let __rawData: any[] = [];
    rawData.forEach((__page: any) => {
        __rawData.push(__page);
    });
    if (topUniqueId && botUniqueId) {
        __rawData = __rawData.map((__node: any) => {
            if (__node.uniqueId === botUniqueId) {
                return {
                    ...__node,
                    parentId: uniqueId,
                }
            }
            return __node;
        })
    }

    let newResData = {
        parentId: topUniqueId,
        uniqueId: uniqueId,
        title,
        body,
        createdAt: uniqueId,
        updatedAt: uniqueId,
        bookId,
        identity
    };
    let newRawData = __rawData;
    newRawData.push(newResData);
    let newApiData = sortAll(newRawData, []);
    let newActivePage = setActivePageFn({
        apiData: newApiData,
        compareId: activePage.uniqueId
    });
    let vue: vue = {
        viewType: "DOCUMENT"
    }
    dispatch({
        type: BOOK_SERVICE.SETTERS,
        setters: {
            keys: ['rawData', 'apiData', 'activePage', 'vue'],
            values: [newRawData, newApiData, newActivePage, vue]
        }
    })
}

export const getPageProps = (props: any, context: BookContextType) => {
    const { apiData, dispatch, dispatcher } = context;
    const { page, pages } = props;
    let sections: any = null;
    if (page.child && Array.isArray(page.child) && page.child.length > 0) {
        sections = page.child;
    }

    return {
        page,
        getSections: () => {
            if (!sections) return null;
            if (sections && sections.length === 0) return null;
            return sections;
        },
        setActiveSection: (section: Section) => {
            const activePage_ = setActivePageFn({
                apiData,
                compareId: section.uniqueId
            });
            __set(dispatch, activePage_);
        },
        createNewSection: () => {
            const { child: sections } = page;
            const topUniqueId = page.uniqueId;
            let botUniqueId = null;
            if (sections && Array.isArray(sections) && sections.length > 0) {
                botUniqueId = sections[0].uniqueId;
            }
            let newFormData = {
                title: '',
                body: '',
                identity: 105,
                topUniqueId,
                botUniqueId
            }
            let vue: vue = {
                viewType: 'FORM',
                document: {type: null},
                form: {method: 'Create', data: newFormData, url: CREATE_UPDATE_ANY},
                callback: (formResponse: any) => updateRawData(context, newFormData, formResponse)
            }
            dispatch({
                type: BOOK_SERVICE.SETTERS,
                setters: {
                    keys: ['vue'],
                    values: [vue]
                }
            })
        },
        createNewChapter: () => {
            const topUniqueId = page.uniqueId;
            let botUniqueId: any = null;
            pages.forEach((_page: any, pageIndex: number) => {
                if (_page.uniqueId === page.uniqueId && pages[pageIndex + 1]) {
                    botUniqueId = pages[pageIndex + 1].uniqueId;
                }
            })
            let newFormData = {
                title: '',
                body: '',
                identity: 105,
                topUniqueId,
                botUniqueId
            }
            let vue: vue = {
                viewType: 'FORM',
                document: {type: null},
                form: {method: 'Create', data: newFormData, url: CREATE_UPDATE_ANY},
                callback: (formResponse: any) => updateRawData(context, newFormData, formResponse)
            }
            dispatch({
                type: BOOK_SERVICE.SETTERS,
                setters: {
                    keys: ['vue'],
                    values: [vue]
                }
            })
        },
        setActivePage: () => {
            const activePage = setActivePageFn({
                apiData,
                compareId: page.uniqueId
            });
            __set(dispatch, activePage);
        },
        createSection: (section: Section) => {
            const topUniqueId = section.uniqueId;
            let botUniqueId: any = null;
    
            sections.forEach((_section: any, sectionIndex: number) => {
                if (_section.uniqueId === section.uniqueId && sections[sectionIndex + 1]) {
                    botUniqueId = sections[sectionIndex + 1].uniqueId;
                }
            })
            let newFormData = {
                title: '',
                body: '',
                identity: 105,
                topUniqueId,
                botUniqueId
            }
            let vue: vue = {
                viewType: 'FORM',
                document: {type: null},
                form: {method: 'Create', data: newFormData, url: CREATE_UPDATE_ANY},
                callback: (formResponse: any) => updateRawData(context, newFormData, formResponse)
            }
            dispatch({
                type: BOOK_SERVICE.SETTERS,
                setters: {
                    keys: ['vue'],
                    values: [vue]
                }
            })
        }
    }
}


const updateSubSection = (context: BookContextType, subSection: SubSection, formResponse: any) => {
    const { rawData, dispatch, activePage } = context;
    const { uniqueId } = subSection;
    if (!rawData || !activePage) return;
    const { title, body } = formResponse.cache;

    const newRawData = rawData.map((page: any) => {
        if (page.uniqueId === uniqueId) {
            return { ...page, body, title }
        }
        return page;
    });
    const newApiData = sortAll(newRawData, []);
    let newActivePage = setActivePageFn({
        apiData: newApiData,
        compareId: activePage.uniqueId
    });
    let vue: vue = {
        viewType: "DOCUMENT"
    }
    dispatch({
        type: BOOK_SERVICE.SETTERS,
        setters: {
            keys: ['rawData', 'apiData', 'activePage', 'vue'],
            values: [newRawData, newApiData, newActivePage, vue]
        }
    })
}

export const editSubSection = (context: BookContextType, subSection: SubSection) => {
    const { dispatch } = context;
    let formData = {
        title: subSection.title,
        body: subSection.body,
        identity: subSection.identity
    }
    let vue: vue = {
        viewType: 'FORM',
        document: {type: null},
        form: {method: 'Update', data: formData, url: null},
        callback: (formResponse: any) => updateSubSection(context, subSection, formResponse)
    }
    dispatch({
        type: BOOK_SERVICE.SETTERS,
        setters: {
            keys: ['vue'],
            values: [vue]
        }
    })
}

export const editActivePage = (context: BookContextType, page: Page | Section) => {
    const { dispatch } = context;
    let formData = {
        title: page.title,
        body: page.body,
        identity: page.identity
    }
    let vue: vue = {
        viewType: 'FORM',
        document: {type: null},
        form: {method: 'Update', data: formData, url: null},
        callback: (formResponse: any) => updateSubSection(context, page, formResponse)
    }
    dispatch({
        type: BOOK_SERVICE.SETTERS,
        setters: {
            keys: ['vue'],
            values: [vue]
        }
    })
}

// export const vueSetter = (context: BookContextType) => {
    // const { dispatch } = context;
    // let vue: vue = {
    //     viewType: null,
    //     document: {
    //         type: null,
    //     },
    //     form: {
    //         type: null,
    //         method: null,
    //         data: null,
    //     },
    // }

    // const __dispatch = (keys: any, values: any) => {
    //     dispatch({
    //         type: BOOK_SERVICE.SETTERS,
    //         setters: {
    //             keys,
    //             values
    //         }
    //     })
    // }
    // return {
    //     document: (documentType: NODE_TYPE) => {
    //         vue.type = VUE.DOCUMENT;
    //         vue.document.type = documentType;
    //         __dispatch(['vue'], [vue]);
    //     }, 
    //     form: (formMethod: HTTP_METHODS, formData: any) => {
    //         vue.type = VUE.FORM;
    //         vue.form.type = getFormType(formData.identity);
    //         vue.form.method = formMethod;
    //         vue.form.data = formData;
    //         console.log(vue);
    //         __dispatch(['vue'], [vue]);
    //     }
    // }
// }
