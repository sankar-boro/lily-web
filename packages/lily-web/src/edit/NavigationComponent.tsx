import { useBookContext, getPageProps, createNewPage, createNewSection, setActivePage, setActiveSection } from "lily-service";
import { BookContextType, Section} from "lily-types";
import { 
    AddSectionUpperContainer, 
    AddSectionInnerContainer,
    AddChapterUpperContainer,
    PageNavContainer, 
    PagesNavContainer, 
    SectionNavContainer, 
    SectionsNavContainer, 
    PageTitleContainer,
    SectionTitleContainer
} from "lily-web/components";

const AddChapter = (props: any) => {
    const { pageIndex, page, context } = props;
    if (pageIndex === 0) return null;

    return <AddSectionUpperContainer>        
        <div className="add-item" onClick={() => createNewSection(context, page, null)}>
            + Add section
        </div>
    </AddSectionUpperContainer>
}

const PageNavComponent = (props: {
    page: any,
    pageIndex: number,
    pages: any
}) => {
    const context = useBookContext();
    const { pageIndex, pages, page } = props;
    const allSections = page.child;
    
    return (
        <PageNavContainer>
            <PageTitleContainer>
                <div onClick={() => setActivePage(context, page)}>
                    {page.title}
                </div>
            </PageTitleContainer>
            <AddChapter pageIndex={pageIndex} page={page} context={context} />
            <SectionsNavContainer>
                {allSections && allSections.map((section: Section, sectionIndex: number) => {
                    return <SectionNavContainer key={sectionIndex}>
                    <SectionTitleContainer>
                        <div onClick={() => setActiveSection(context, section)}>
                            {section.title}
                        </div>
                    </SectionTitleContainer>
                    <AddSectionInnerContainer>
                        <div className="add-item" onClick={() => createNewSection(context, page, section)}>
                            + Add section
                        </div>
                    </AddSectionInnerContainer>
                </SectionNavContainer>;
                })} 
            </SectionsNavContainer>
            <AddChapterUpperContainer>
                <div className="add-item" onClick={() => createNewPage(context, { page, pages })}>
                    + Add chapter
                </div>
            </AddChapterUpperContainer>
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
