import { useBlogContext } from "lily-service";
import { getPageProps, createNewPage, createNewSection, setActivePage, setActiveSection } from "lily-utils";

import { BlogContextType, Section} from "lily-types";
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

const AddNode = (props: any) => {
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
    const context = useBlogContext();
    const { pageIndex, pages, page } = props;
    const allSections = page.child;
    
    return (
        <PageNavContainer>
            <PageTitleContainer>
                <div>
                    {page.title}
                </div>
            </PageTitleContainer>
            <AddNode pageIndex={pageIndex} page={page} context={context} />
        </PageNavContainer>
    )
}

const Main = () => {
    const { apiData: pages }: BlogContextType = useBlogContext();
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
