import { useBookContext} from "../../service/BookServiceProvider";
import { constants } from "../../globals/constants";

const { leftBar } = constants.heights.fromTopNav;

const ReadBookNavigation = (props: any) => {
    const context: any = useBookContext();
    const { apiData } = context;

    const doSome = (data: any) => {
        let child = [];
        if (data && data.child && Array.isArray(data.child)) {
            child = data.child;
        }

        return {
            chapter: data,
            sections: child,
        };
    };
    return (
        <div className="con-19 scroll-view" style={{ padding: "0px 10px", position: "fixed", height: "100%" }}>
            <div style={{height: leftBar }}/>
            {apiData.map((value: any, index: number) => {
                const { chapter, sections } = doSome(value);
                return (
                    <div key={chapter.title}>
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                context.dispatch({
                                    type: 'ACTIVE_PAGE',
                                    pageId: chapter.uniqueId,
                                    sectionId: null,
                                });
                            }}
                            className="chapter-nav hover"
                        >
                            {chapter.title}
                        </div>
                        <div>
                            {sections.map((c: any) => {
                                return (
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            context.dispatch({
                                                type: 'ACTIVE_PAGE',
                                                pageId: chapter.uniqueId,
                                                sectionId: c.uniqueId,
                                            });
                                        }}
                                        key={c.uniqueId}
                                        className="section-nav hover"
                                    >
                                        {c.title}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ReadBookNavigation;
