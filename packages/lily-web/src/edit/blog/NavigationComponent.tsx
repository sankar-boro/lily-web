import { useBlogContext } from "lily-service";
import { BlogContextType } from "lily-types";
import {
    PageNavContainer, 
    PagesNavContainer,
    PageTitleContainer
} from "lily-web/components";


const PageNavComponent = (props: {
    page: any,
    pageIndex: number,
    pages: any
}) => {
    const { page } = props;
    
    return (
        <PageNavContainer>
            <PageTitleContainer>
                <div>
                    {page.title}
                </div>
            </PageTitleContainer>
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
