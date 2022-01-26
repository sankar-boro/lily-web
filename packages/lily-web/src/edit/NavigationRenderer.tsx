import { createChapter, createSection } from "lily-components";
import { setActivePageFn } from "lily-service";
import { BOOK_SERVICE } from "lily-types";

const Sections = (props: any) => {
    const { page, context } = props;
    const { dispatch, apiData } = context;

    let sections: any = null;

    if (page.child && Array.isArray(page.child) && page.child.length > 0) {
        sections = page.child;
    }

    if (!sections) return null;
    if (sections && sections.length === 0) return null;

    const setActiveSection = (section: any) => {
        const activeSection = setActivePageFn({
            apiData,
            compareId: section.uniqueId,
        });
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: [
                {
                    key: 'activePage',
                    value: activeSection
                }
            ]
        })
    }

    const Section = (props: any) => {
        const { section, sectionIndex } = props;
        return <div key={`${sectionIndex}`} className="Section">
            <div
                onClick={setActiveSection}
                key={section.uniqueId}
                className="section-nav hover tooltip"
                onMouseEnter={() => {}}
            >
                {section.title}
                <span className="tooltiptext">{section.uniqueId}</span>
            </div>
            <AddSection {...props} sectionIndex={sectionIndex} sections={sections} />
        </div>
    }

    return <div> {sections.map((section: any, sectionIndex: number) => {
        return <Section 
            section={section}
            sectionIndex={sectionIndex}
        />;
    })} 
    </div>
}

const PageTitle = (props: any) => {
    const { page, context } = props;
    const { dispatch, apiData } = context;
    
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

const AddSection = (props: any) => {
    const { pageIndex } = props;

    if (pageIndex === 0) return null;
    
    return <div 
        className="hover" 
        style={{marginTop:5}}
        onClick={(e: any) => {
            e.preventDefault();
            createSection(props);
        }}
    >
        <span style={{ marginLeft: 20, fontSize: 12 }}>+ Add section</span>
    </div>
}

const AddChapter = (props: any) => {
    return (
        <div
            style={{marginTop:5}}
            className="hover"
            onClick={(e: any) => {
                e.preventDefault();
                createChapter(props);
            }}
        >
            <span style={{ fontSize: 12 }}>+ Add chapter</span>
        </div>
    );
}

const NavigationPages = (props: any) => {
    const { page } = props;
    return (
        <div style={styles.chapter} key={page.uniqueId}>
            <PageTitle {...props} />
            <AddSection {...props} />
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
            {pages.map((page: any, pageIndex: number) => 
                <NavigationPages 
                    page={page} 
                    pageIndex={pageIndex} 
                    context={context} 
                    key={page.uniqueId} 
                />
            )}
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
