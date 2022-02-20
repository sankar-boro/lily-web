import { useBookContext } from "lily-service";
import { BookContextType} from "lily-types";
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
import { getPageProps } from "./utils";

const AddChapter = (props: any) => {
    const { createNewSection, pageIndex } = props;
    if (pageIndex === 0) return null;

    return <AddSectionUpperContainer>        
        <div onClick={() => createNewSection()}>
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
    const sectionProps = getPageProps(props, context);
    const {
        createNewSection,
        setActivePage,
        setActiveSection,
        createSection,
        page,
        getSections,
        createNewChapter
    } = sectionProps;
    const allSections = getSections();
    const { pageIndex } = props;
    return (
        <PageNavContainer>
            <PageTitleContainer>
                <div onClick={() => setActivePage()}>
                    {page.title}
                </div>
            </PageTitleContainer>
            <AddChapter 
                createNewSection={createNewSection}
                pageIndex={pageIndex}
            />
            <SectionsNavContainer>
                {allSections && allSections.map((section: any, sectionIndex: number) => {
                    return <SectionNavContainer key={sectionIndex}>
                    <SectionTitleContainer>
                        <div onClick={() => setActiveSection(section)}>
                            {section.title}
                        </div>
                    </SectionTitleContainer>
                    <AddSectionInnerContainer>
                        <div onClick={() => createSection(section)}>
                            + Add section
                        </div>
                    </AddSectionInnerContainer>
                </SectionNavContainer>;
                })} 
            </SectionsNavContainer>
            <AddChapterUpperContainer>
                <div onClick={() => createNewChapter()}>
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
