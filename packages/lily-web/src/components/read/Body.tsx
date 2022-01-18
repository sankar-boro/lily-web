import { useHistory } from "react-router-dom";
import { MdHome, MdSearch } from 'react-icons/md';
import { Node } from "../../globals/types/book";
import { useBookContext } from "../../service/BookServiceProvider";
import { constants } from "../../globals/constants";

const { topBar } = constants.heights.fromTopNav;

const SubSections = (props: any) => {
    const { activePage, context } = props;
    const { hideSection } = context;

    if (hideSection) return null;
    if (!activePage) return null;
    if (!activePage.child) return null;
    if (!Array.isArray(activePage.child)) return null;
    const sections = activePage.child;

    return sections.map((x: Node) => {
        return (
            <div key={x.uniqueId}>
                <h4 className="h4" id={x.uniqueId}>{x.title}</h4>
                <div className="description">{x.body}</div>
            </div>
        );
    })
}

const Padding_H_10 = () => {
    return <div className="con-10" />
}

const Divider = (props: any) => {
    const { activePage, sectionId, context, subSectionIndex } = props;
    const { identity } = activePage;
    const history: any = useHistory();
    const { bookId } = context;
    const editNavigate = (e: any) => {
        e.preventDefault();
        history.push({
            pathname: `/book/edit/${bookId}`,
            state: history.location.state,
        });
    }
    return <div className="con-20">
        <div className="li-item hover" onClick={editNavigate}>Edit</div>
        <div className="li-item hover">Delete</div>
        <div>
            {identity === 105 && activePage.child.map((x: Node, subSectionIndex: number) => {
                return <div className="li-item hover">
                    <a href={`#${x.uniqueId}`}>    
                        {x.title}
                    </a>
                </div>;
            })}
        </div>
    </div>
}

const ReadBodyContainer = (props: any) => {
    const {activePage} = props;
    return  <div className="con-100 flex">
        <div className="con-80 flex" style={{ paddingTop: 50 }}>
            <Padding_H_10 />
            <div className="con-80">
                <h3 className="h2" id={activePage.uniqueId}>{activePage.title}</h3>
                <div className="description">{activePage.body}</div>
                <SubSections {...props} />
            </div>
            <Padding_H_10 />
        </div>
        <Divider {...props} />
    </div>
}

const Main = (props: any) => {
    const { title, activePage, history } = props;
    return (
        <div className="con-80" style={{ marginLeft: "20%" }}>
            <div className="con-100 flex" style={{ height: topBar, alignItems: "center" }}>
                <div className="con-80 flex">
                    <div className="flex con-10" style={{ alignItems: "center" }}>
                        <MdSearch className="hover" style={{ padding: 15 }}/>
                    </div>
                    <div className="con-80 flex center">
                        <h2 className="h2 book-title">{title}</h2>
                    </div>
                    <div className="con-10" />
                </div>
                <div className="con-20 flex">
                    <MdHome className="hover" onClick={() => { history.replace({ pathname: "/"})}}/>
                </div>
            </div>
            <ReadBodyContainer activePage={activePage} {...props} />
        </div>
    );
}

const BodyRenderer = (props: any) => {
    const history: any = useHistory();
    const { title } = history.location.state;
    const context: any = useBookContext();
    const { activePage, sectionId } = context;
    const temp = {title, activePage, sectionId, context, history };

    if (activePage === null) return null;

    return <Main {...temp} />
};

export default BodyRenderer;