import { useHistory } from "react-router-dom";
import { useBookContext } from "lily-service";

const SubSections = (props: any) => {
    const { activePage } = props;

    if (!activePage) return null;
    if (!activePage.child) return null;
    if (!Array.isArray(activePage.child)) return null;
    const subSections = activePage.child;

    return subSections.map((x: any) => {
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
    const { activePage, context } = props;
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
            {identity === 105 && activePage.child.map((x: any, subSectionIndex: number) => {
                return <div className="li-item hover" key={subSectionIndex}>
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
        <div className="con-80 flex">
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
    const { activePage} = props;
    return (
        <div className="con-80" style={{ marginLeft: "20%" }}>
            <ReadBodyContainer activePage={activePage} {...props} />
        </div>
    );
}

const BodyRenderer = () => {
    const history: any = useHistory();
    const context: any = useBookContext();
    const { activePage, sectionId } = context;
    const temp = {activePage, sectionId, context, history };

    if (activePage === null) return null;
    return <Main {...temp} />
};

export default BodyRenderer;