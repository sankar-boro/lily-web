import { useBlogContext } from "lily-service";
import { setActivePage, setActiveSection } from "lily-utils";

import { BlogContextType } from "lily-types";
import {
    PageNavContainer, 
    SectionNavContainer, 
    SectionsNavContainer, 
    PagesNavContainer, 
    PageTitleContainer,
    SectionTitleContainer
} from "lily-web/components";

const PageNavComponent = (props: any) => {
    const context: BlogContextType = useBlogContext();
    const { page } = props;

    return <PageNavContainer>            
        <PageTitleContainer>
            <div>
                {page.title}
            </div>
        </PageTitleContainer>
    </PageNavContainer>
}

const ReadBlogNavigation = () => {
    const { apiData }: BlogContextType = useBlogContext();
    if (!apiData) return null;
    return (
        <PagesNavContainer>
            {apiData.map((value: any, index: number) => {
                return <PageNavComponent page={value} key={index} />;
            })}
        </PagesNavContainer>
    );
};

export default ReadBlogNavigation;
