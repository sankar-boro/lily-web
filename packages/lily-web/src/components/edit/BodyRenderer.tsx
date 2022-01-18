import { useHistory } from "react-router-dom";
import { MdHome, MdModeEdit, MdSearch, MdDelete } from 'react-icons/md';

import { deleteSection, deletePage, deleteSubSection } from "./crud/delete/index";
import Divider from "./Divider";
import Update from "../forms/Update";
import AddSection from "../forms/Section";
import AddChapter from "../forms/Chapter";
import SubSection from "../forms/SubSection";
import CreateUpdate from "../forms/CreateUpdate";
import { Node, FORM_TYPE } from "../../globals/types/index";
import { useBookContext } from "../../service/BookServiceProvider";
import { constants } from "../../globals/constants";

const { topBar } = constants.heights.fromTopNav;

const FormView = (props: any) => {
    const { state } = props;
    if (state === FORM_TYPE.CHAPTER) {
        return <AddChapter />;
    }
    if (state === FORM_TYPE.SECTION) {
        return <AddSection />;
    }
    if (state === FORM_TYPE.SUB_SECTION) {
        return <SubSection />;
    }
    if (state === FORM_TYPE.CREATE_UPDATE) {
        return <CreateUpdate />;
    }
    if (state === FORM_TYPE.UPDATE) {
        return <Update />;
    }
    return null;
};

const logger = (identity: number) => {
    if (identity === 104) {
        console.log("Page");
    } else if (identity === 105) {
        console.log("Section");
    } else {
        console.log("Home");
    }
}


const SubSections = (props: any) => {
    const { activePage, context } = props;
    const { hideSection, dispatch, bookId } = context;
    if (hideSection) return null;
    if (!activePage) return null;
    if (!activePage.child) return null;
    if (!Array.isArray(activePage.child)) return null;
    const subSections = activePage.child;

    return subSections.map((subSection: any, sectionIndex: number) => {
        return (
            <div key={subSection.uniqueId}>
                <div className="flex center">
                    <div className="con-95">
                        <h3 className="h3">{subSection.title}</h3>
                    </div>
                    <div className="con-5 hover">
                        <MdModeEdit onClick={() => {
                            const { child, ...others } = subSection;
                            dispatch({
                                type: 'FORM_PAGE_SETTER',
                                viewType: FORM_TYPE.UPDATE,
                                payload: others,
                            });
                        }}/>
                        <MdDelete onClick={() => {deleteSubSection({
                            section: activePage, 
                            subSection,
                            bookId,
                        })}}/>
                    </div>
                </div>
                <div className="description">{subSection.body}</div>
            </div>
        );
    })
}

const Body = () => {
    const context: any = useBookContext();
    const { dispatch, activePage, viewState } = context;
    
    if (activePage === null) return null;
    const { child, ...activePageDetails } = activePage;
    const { identity } = activePageDetails;
    
    if (viewState !== FORM_TYPE.NONE) {
        return (
            <div className="flex">
                <div className="con-80 flex">
                    <div className="con-10" />
                    <div className="con-80">
                        <FormView state={viewState} />
                    </div>
                    <div className="con-10" />
                </div>
                <Divider {...context} />
            </div>
        );
    }

    /** 
     * This sections only contains delete and edit for
     * 104, 105.
     * 101 not yet implemented.
     */
    const Edit = () => {
        const edit = () => dispatch({
            type: 'FORM_PAGE_SETTER',
            viewType: FORM_TYPE.UPDATE,
            payload: activePageDetails,
        });
        return <MdModeEdit onClick={edit}/>
    }
    const Delete = () => {
        const _deletePage = (e: any) => {
            e.preventDefault();
            deletePage(context);
        };
        const _deleteSection = (e: any) => {
            e.preventDefault();
            deleteSection(context);
        };
        if (identity === 104) return <MdDelete onClick={_deletePage}/>
        if (identity === 105) return <MdDelete onClick={_deleteSection}/>
        return null;
    }

    return (
        <div className="flex">
            <div className="con-80 flex">
                <div className="con-10" />
                <div className="con-80" style={{ paddingTop: 50 }}>
                    <div className="flex center">
                        <div className="con-95">
                            <h3 className="h3">{activePage.title}</h3>
                        </div>
                        <div className="con-5 hover">
                            <Edit />
                            <Delete />
                        </div>
                    </div>
                    <div className="description">{activePage.body}</div>
                    <SubSections activePage={activePage} context={context} />
                </div>
                <div className="con-10" />
            </div>
            <Divider {...context} />
        </div>
    );
}

const Header = () => {
    const history: any = useHistory();
    const { title } = history.location.state;

    const goHome = () => { history.replace({ pathname: "/"})};

    return <div className="con-100 flex" style={{ height: topBar, alignItems: "center" }}>
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
            <MdHome className="hover" onClick={goHome}/>
        </div>
    </div>
}

const BodyRenderer = () => {
    return <div className="con-80" style={{ marginLeft: "20%" }}>
        <Header />
        <Body />
    </div>
};

export default BodyRenderer;