import { createChapter } from "lily-components";
import { setActivePageFn, useBookContext } from "lily-service";
import { BOOK_SERVICE, VUE } from "lily-types";

const AddNewSectionInner = (props: {
    section: any,
    sections: any,
}) => {
    const context = useBookContext();
    const { dispatch } = context;
    const { section, sections } = props;
    const topUniqueId = section.uniqueId;
    let botUniqueId: any = null;

    sections.forEach((_section: any, sectionIndex: number) => {
        if (_section.uniqueId === section.uniqueId && section[sectionIndex + 1]) {
            botUniqueId = sections[sectionIndex + 1].uniqueId;
        }
    })

    const formData = {
        topUniqueId,
        botUniqueId
    }

    const createSection = () => {
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: [
                {
                    key: 'vue',
                    value: VUE.FORM,
                },
                {
                    key: 'formData',
                    value: formData
                }
            ]
        })
    }

    return <div 
        className="hover" 
        style={{marginTop:5}}
        onClick={createSection}
    >
        <span style={{ marginLeft: 20, fontSize: 12 }}>+ Add section</span>
    </div>
}

const Section = (props: any) => {
    const { section, sections } = props;
    const { dispatch, apiData } = useBookContext();
    
    const setActiveSection = (e: any) => {
        e.preventDefault();
        const activePage = setActivePageFn({
            apiData,
            compareId: section.uniqueId
        });
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: [
                {
                    key: 'activePage',
                    value: activePage
                },
                {
                    key: 'vue',
                    value: VUE.DOCUMENT
                }
            ]
        })
    };

    return <div key={`${section.uniqueId}`} className="Section">
        <div
            onClick={setActiveSection}
            key={section.uniqueId}
            className="section-nav hover tooltip"
        >
            {section.title}
            <span className="tooltiptext">{section.uniqueId}</span>
        </div>
        <AddNewSectionInner {...props} sections={sections} section={section} />
    </div>
}

const Sections = (props: {
    page: any,
    pageIndex: number
}) => {
    const { page } = props;

    let sections: any = null;

    if (page.child && Array.isArray(page.child) && page.child.length > 0) {
        sections = page.child;
    }

    if (!sections) return null;
    if (sections && sections.length === 0) return null;

    return <div> {sections.map((section: any, sectionIndex: number) => {
        return <Section section={section} sections={sections} key={sectionIndex} />;
    })} 
    </div>
}

const PageTitle = (props: any) => {
    const { page } = props;
    const { dispatch, apiData, activePage } = useBookContext();
    
    const setActivePage = (e: any) => {
        e.preventDefault();
        const activePage = setActivePageFn({
            apiData,
            compareId: page.uniqueId
        });
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: [
                {
                    key: 'activePage',
                    value: activePage
                },
                {
                    key: 'vue',
                    value: VUE.DOCUMENT
                }
            ]
        })
    };

    return <div
        onClick={setActivePage}
        className="chapter-nav hover tooltip"
    >
        {page.title}
        <span className="tooltiptext">{page.uniqueId}</span>
    </div>
}

const AddChapter = (props: {
    page: any,
    pageIndex: number,
}) => {
    const context = useBookContext();
    return (
        <div
            style={{marginTop:5}}
            className="hover"
            onClick={(e: any) => {
                e.preventDefault();
                createChapter(context, props);
            }}
        >
            <span style={{ fontSize: 12 }}>+ Add chapter</span>
        </div>
    );
}

const AddNewSectionUpper = (props: any) => {
    const context = useBookContext();
    const { dispatch } = context;
    const { page, pageIndex } = props;
    const { child: sections } = page;
    const topUniqueId = page.uniqueId;
    let botUniqueId = null;
    if (sections && Array.isArray(sections) && sections.length > 0) {
        botUniqueId = sections[0].uniqueId;
    }
    let formData = {
        topUniqueId,
        botUniqueId,
    }

    const createNewSection = () => {
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: [
                {
                    key: 'vue',
                    value: VUE.FORM,
                },
                {
                    key: 'formData',
                    value: formData
                }
            ]
        })
    }

    return <div 
        className="hover" 
        style={{ marginTop: 5, marginBottom: 5 }}
        onClick={createNewSection}
    >
        <span style={{ marginLeft: 20, fontSize: 12 }}>+ Add section</span>
    </div>
}

const NavigationPages = (props: {
    page: any,
    pageIndex: number
}) => {
    return (
        <div style={styles.chapter} key={props.page.uniqueId}>
            <PageTitle {...props} />
            <AddNewSectionUpper {...props } />
            <Sections {...props} />
            <AddChapter {...props} />
        </div>
    )
}

const Main = (props: any) => {
    const { context } = props;
    const { apiData: pages } = context;
    return (
        <div className="con-19 scroll-view" style={{ padding: "0px 10px", position: "fixed", height: "100%" }}>
            <div style={{ height: 35 }}/>
            {pages.map((page: any, pageIndex: number) => <NavigationPages page={page} pageIndex={pageIndex} key={pageIndex} />)}
        </div>
    );
};

export default Main;

const styles = {
    container: { width: "18%", marginTop: 24, paddingLeft: 8 },
    chapter: {
        paddingTop: 5,
        paddingBottom: 5,
    }
}
