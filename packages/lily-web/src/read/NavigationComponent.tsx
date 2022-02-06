import { useBookContext, setActivePageFn } from "lily-service";
import { BOOK_SERVICE } from "lily-types";
import { 
    ChapterNavContainer, 
    PageNavContainer, 
    SectionNavContainer, 
    SectionsNavContainer, 
    PagesNavContainer 
} from "lily-web/components";

const ReadBookNavigation = () => {
    const context: any = useBookContext();
    const { apiData, dispatch } = context;

    const PageNavComponent = (props: any) => {
        const { page } = props;
        const { uniqueId: pageId, child: sections } = page;
        const {} = page;
        
        const setActivePage = (e: any) => {
            e.preventDefault();
            const page = setActivePageFn({
                apiData,
                compareId: pageId, 
            });

            dispatch({
                type: BOOK_SERVICE.SETTERS,
                setters: {
                    keys: ['activePage'],
                    values: [page]
                }
            });
        }

        const setActiveSection = (section: any) => {
            const page = setActivePageFn({
                apiData,
                compareId: section.uniqueId, 
            });

            dispatch({
                type: BOOK_SERVICE.SETTERS,
                setters: {
                    keys: ['activePage'],
                    values: [page]
                }
            });
        }

        return <PageNavContainer>            
            <ChapterNavContainer>
                <div onClick={setActivePage}>
                    {page.title}
                </div>
            </ChapterNavContainer>
            <SectionsNavContainer>
                {sections.map((section: any) => {
                    return <SectionNavContainer key={section.uniqueId}>
                        <div onClick={() => setActiveSection(section)}>
                            {section.title}
                        </div>
                    </SectionNavContainer>
                })}
            </SectionsNavContainer>
        </PageNavContainer>
    }

    return (
        <PagesNavContainer>
            {apiData.map((value: any, index: number) => {
                return <PageNavComponent page={value} key={index} />;
            })}
        </PagesNavContainer>
    );
};

export default ReadBookNavigation;
