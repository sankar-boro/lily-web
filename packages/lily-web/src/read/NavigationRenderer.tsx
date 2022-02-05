import { useBookContext, setActivePageFn } from "lily-service";
import { BOOK_SERVICE } from "lily-types";

const ReadBookNavigation = () => {
    const context: any = useBookContext();
    const { apiData, dispatch } = context;

    const Page = (props: any) => {
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
                type: BOOK_SERVICE.SETTERSV1,
                settersv1: {
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
                type: BOOK_SERVICE.SETTERSV1,
                settersv1: {
                    keys: ['activePage'],
                    values: [page]
                }
            });
        }

        return <div key={page.title}>
            <div
                onClick={setActivePage}
                className="chapter-nav"
            >
                {page.title}
            </div>
            <div>
                {sections.map((section: any) => {
                    return (
                        <div
                            onClick={() => setActiveSection(section)}
                            key={section.uniqueId}
                            className="section-nav hover"
                        >
                            {section.title}
                        </div>
                    );
                })}
            </div>
        </div>
    }

    return (
        <div className="con-19 scroll-view" style={{ padding: "0px 10px", position: "fixed", height: "100%" }}>
            {apiData.map((value: any, index: number) => {
                return <Page page={value} key={index} />;
            })}
        </div>
    );
};

export default ReadBookNavigation;
