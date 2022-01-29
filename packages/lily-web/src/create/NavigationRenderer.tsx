// import { createChapter } from "lily-components";
import { setActivePageFn, useBookContext } from "lily-service";
import { BOOK_SERVICE, VUE } from "lily-types";

const __create = (dispatch: any, formData: any) => {
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

const __set = (dispatch: any, activePage: any) => {
    dispatch({
        type: BOOK_SERVICE.SETTERS,
        setters: [
            {
                key: 'vue',
                value: VUE.DOCUMENT
            },
            {
                key: 'activePage',
                value: activePage
            }
        ]
    })
}

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
        if (_section.uniqueId === section.uniqueId && sections[sectionIndex + 1]) {
            botUniqueId = sections[sectionIndex + 1].uniqueId;
        }
    })

    const formData = {
        topUniqueId,
        botUniqueId,
        identity: 105
    }

    const createSection = () => __create(dispatch, formData);

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
        __set(dispatch, activePage);
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

    return <div> 
        {sections.map((section: any, sectionIndex: number) => {
            return <Section section={section} sections={sections} key={sectionIndex} />;
        })} 
    </div>
}

const PageTitle = (props: any) => {
    const { page } = props;
    const { dispatch, apiData } = useBookContext();
    
    const setActivePage = () => {
        const activePage = setActivePageFn({
            apiData,
            compareId: page.uniqueId
        });
        __set(dispatch, activePage);
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
    pages: any
}) => {
    const { page, pages } = props;
    const context = useBookContext();
    const { dispatch } = context;
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
        identity: 104
    }
    const createNewChapter = () => {
        __create(dispatch, formData);
    }
    return (
        <div
            style={{marginTop:5}}
            className="hover"
            onClick={createNewChapter}
        >
            <span style={{ fontSize: 12 }}>+ Add chapter</span>
        </div>
    );
}

const AddNewSectionUpper = (props: {
    page: any,
    pageIndex: number
}) => {
    const context = useBookContext();
    const { dispatch } = context;
    const { page } = props;
    const { child: sections } = page;
    const topUniqueId = page.uniqueId;
    let botUniqueId = null;
    if (sections && Array.isArray(sections) && sections.length > 0) {
        botUniqueId = sections[0].uniqueId;
    }
    let formData = {
        topUniqueId,
        botUniqueId,
        identity: 105
    }

    const createNewSection = () => {
        __create(dispatch, formData);
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
    pageIndex: number,
    pages: any
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
    const { apiData: pages, activePage } = context;

    if (!activePage) return null;
    return (
        <div className="con-19 scroll-view" style={{ padding: "0px 10px", position: "fixed", height: "100%" }}>
            <div style={{ height: 35 }}/>
            {pages.map((page: any, pageIndex: number) => <NavigationPages page={page} pageIndex={pageIndex} key={pageIndex} pages={pages}/>)}
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
