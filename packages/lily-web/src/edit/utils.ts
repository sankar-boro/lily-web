import { setActivePageFn } from "lily-service";
import { BookContextType, BOOK_SERVICE, NODE_TYPE, Section, Sections, VUE } from "lily-types";

const __set = (dispatch: any, activePage: any) => {
    dispatch({
        type: BOOK_SERVICE.SETTERS,
        setters: {
            keys: ['vue', 'activePage'],
            values: [VUE.DOCUMENT, activePage]
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
            let formData = {
                topUniqueId,
                botUniqueId,
                identity: 105,
                type: 'NEW_NODE'
            }
            dispatcher?.setVue({
                type: 'FORM',
                document: {
                    type: null,   
                },
                form: {
                    type: NODE_TYPE.SECTION,
                    method: 'CREATE',
                    url: '',
                    data: formData
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
            const formData = {
                topUniqueId,
                botUniqueId,
                identity: 104,
                type: 'NEW_NODE'
            }
            dispatcher?.setVue({
                type: 'FORM',
                document: {
                    type: null,   
                },
                form: {
                    type: NODE_TYPE.PAGE,
                    method: 'CREATE',
                    url: '',
                    data: formData
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
    
            const formData = {
                topUniqueId,
                botUniqueId,
                identity: 105,
                type: 'NEW_NODE'
            }
            dispatcher?.setVue({
                type: 'FORM',
                document: {
                    type: null,   
                },
                form: {
                    type: NODE_TYPE.SECTION,
                    method: 'CREATE',
                    url: '',
                    data: formData
                }
            })
        }
    }
}