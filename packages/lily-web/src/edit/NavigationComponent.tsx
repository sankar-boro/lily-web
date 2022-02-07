import { setActivePageFn, useBookContext } from "lily-service";
import { BookContextType, BOOK_SERVICE, VUE } from "lily-types";
import { 
    AddSectionUpperContainer, 
    AddSectionInnerContainer,
    AddChapterUpperContainer,
    ChapterNavContainer, 
    PageNavContainer, 
    PagesNavContainer, 
    SectionNavContainer, 
    SectionsNavContainer, 
    PageTitleContainer,
    SectionTitleContainer
} from "lily-web/components";

const __create = (dispatch: any, formData: any) => {
    dispatch({
        type: BOOK_SERVICE.SETTERS,
        setters: {
            keys: ['vue', 'formData'],
            values: [VUE.FORM, formData]
        }
    })
}

const __set = (dispatch: any, activePage: any) => {
    dispatch({
        type: BOOK_SERVICE.SETTERS,
        setters: {
            keys: ['vue', 'activePage'],
            values: [VUE.DOCUMENT, activePage]
        }
    })
}

const AddNewSectionComponent = (props: {
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
        identity: 105,
        type: 'NEW_NODE'
    }

    const createSection = () => __create(dispatch, formData);

    return <AddSectionInnerContainer>
        <div onClick={createSection}>
            + Add section
        </div>
    </AddSectionInnerContainer>
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

    return <div onClick={setActivePage}>
        {page.title}
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
        identity: 104,
        type: 'NEW_NODE'
    }
    const createNewChapter = () => {
        __create(dispatch, formData);
    }
    return <AddChapterUpperContainer>
        <div onClick={createNewChapter}>
            + Add chapter
        </div>
    </AddChapterUpperContainer>
}

const AddNewSectionUpper = (props: {
    page: any,
    pageIndex: number
}) => {
    const { page, pageIndex } = props;
    if (pageIndex === 0) return null;
    const context = useBookContext();
    const { dispatch } = context;
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

    const createNewSection = () => {
        __create(dispatch, formData);
    }

    return <AddSectionUpperContainer>        
        <div onClick={createNewSection}>
            + Add section
        </div>
    </AddSectionUpperContainer>
}

const SectionComponent = (props: any) => {
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

    return <SectionNavContainer>
        <SectionTitleContainer>
            <div onClick={setActiveSection}>
                {section.title}
            </div>
        </SectionTitleContainer>
        <AddNewSectionComponent {...props} sections={sections} section={section} />
    </SectionNavContainer>
}

const SectionsComponent = (props: {
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

    return <SectionsNavContainer>
        {sections.map((section: any, sectionIndex: number) => {
            return <SectionComponent section={section} sections={sections} key={sectionIndex} />;
        })} 
    </SectionsNavContainer>
}

const PageNavComponent = (props: {
    page: any,
    pageIndex: number,
    pages: any
}) => {
    return (
        <PageNavContainer>
            <PageTitleContainer>
                <PageTitle {...props} />
            </PageTitleContainer>
            <AddNewSectionUpper {...props } />
            <SectionsComponent {...props} />
            <AddChapter {...props} />
        </PageNavContainer>
    )
}

const Main = () => {
    const { apiData: pages }: BookContextType = useBookContext();
    if (pages === null) return null;
    
    return (
        <PagesNavContainer>
            {pages.map((page: any, pageIndex: number) => {
                return <PageNavComponent page={page} pageIndex={pageIndex} key={pageIndex} pages={pages}/>
            })}
        </PagesNavContainer>
    );
};

export default Main;
