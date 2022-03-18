import { useBookContext } from "lily-service";
import { setActivePage, setActiveSection } from "lily-utils";

import { BookContextType } from "lily-types";
import {
    PageNavContainer, 
    SectionNavContainer, 
    SectionsNavContainer, 
    PagesNavContainer, 
    PageTitleContainer,
    SectionTitleContainer
} from "lily-web/components";

const PageNavComponent = (props: any) => {
    const context: BookContextType = useBookContext();
    const { page } = props;
    const { child: sections } = page;

    return <PageNavContainer>            
        <PageTitleContainer>
            <div onClick={() => setActivePage(context, page)}>
                {page.title}
            </div>
        </PageTitleContainer>
        <SectionsNavContainer>
            {sections.map((section: any) => {
                return <SectionNavContainer key={section.uniqueId}>
                    <SectionTitleContainer>
                        <div onClick={() => setActiveSection(context, section)}>
                            {section.title}
                        </div>
                    </SectionTitleContainer>
                </SectionNavContainer>
            })}
        </SectionsNavContainer>
    </PageNavContainer>
}

const ReadBookNavigation = () => {
    const { apiData }: BookContextType = useBookContext();
    if (!apiData) return null;
    return (
        <PagesNavContainer>
            {apiData.map((value: any, index: number) => {
                return <PageNavComponent page={value} key={index} />;
            })}
        </PagesNavContainer>
    );
};

export default ReadBookNavigation;
