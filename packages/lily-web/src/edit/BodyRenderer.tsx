import { useHistory } from "react-router-dom";
import { MdHome, MdModeEdit, MdSearch, MdDelete } from 'react-icons/md';
import { deleteSection, deletePage, deleteSubSection } from "lily-components";

import Divider from "./Divider";
import { BOOK_SERVICE, constants, FORM_TYPE, VUE } from "lily-types";
import { useBookContext } from "lily-service";
import AllForm from "lily-web/forms/AllForm";

const { topBar } = constants.heights.fromTopNav;

const FormView = (props: any) => {
    const { state } = props;
    if (state === VUE.FORM) {
        return <AllForm />;
    }
    return null;
};

const SubSectionBody = (props: any) => {
    const { subSection } = props;
    const context: any = useBookContext();
    const { dispatch } = context;

    const _delete = async (e: any) => {
        e.preventDefault();
        await deleteSubSection(context, subSection);
    }
    
    const _edit = (subSection: any) => {
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: [
                {
                    key: 'formData',
                    value: subSection,
                },
                {
                    key: 'vue',
                    value: FORM_TYPE.UPDATE
                }
            ]
        });
    }

    return <div key={subSection.uniqueId}>
        <div className="flex center">
            <div className="con-95">
                <h3 className="h3 tooltip">
                    {subSection.title}
                    <span className="tooltiptext">
                        {subSection.uniqueId}
                    </span>
                </h3>
            </div>
            <div className="con-5 hover">
                <MdModeEdit onClick={_edit}/>
                <MdDelete onClick={_delete}/>
            </div>
        </div>
        <div className="description">{subSection.body}</div>
    </div>
}

const DeleteBody = (props: any) => {
    const { context, identity } = props;
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

const Body = () => {
    const context: any = useBookContext();
    const { vue, activePage, dispatch } = context;
    if (vue === VUE.FORM) {
        return (
            <div className="flex">
                <div className="con-80 flex">
                    <div className="con-10" />
                    <div className="con-80">
                        <FormView state={vue} />
                    </div>
                    <div className="con-10" />
                </div>
                <Divider {...context} />
            </div>
        );
    }

    const SectionBody = () => {
        if (activePage.identity === 104) return null;
        return activePage.child.map((subSection: any, subSectionIndex: number) => {
            return <SubSectionBody subSection={subSection} key={subSectionIndex} />
        })
    }

    const Edit = () => {
        const edit = () => dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: [
                {
                    key: 'viewType',
                    value: FORM_TYPE.UPDATE
                },
                {
                    key: 'formData',
                    value: activePage
                }
            ]
        })

        return <MdModeEdit onClick={edit}/>
    }
    
    return <div className="flex">
        <div className="con-80 flex">
            <div className="con-10" />
            <div className="con-80" style={{ paddingTop: 50 }}>
                <div className="flex center">
                    <div className="con-95">
                        <h3 className="h3">{activePage.title}</h3>
                    </div>
                    <div className="con-5 hover">
                        <Edit />
                        <DeleteBody 
                            context={context}
                            identity={activePage.identity}
                        />
                    </div>
                </div>
                <div className="description">{activePage.body}</div>
                <SectionBody />
            </div>
            <div className="con-10" />
        </div>
        <Divider />
    </div>
}

const BodyRenderer = () => {
    const history: any = useHistory();
    const context: any = useBookContext();
    const { title } = history.location.state;
    const { apiData: _apiDAta } = context;
    const goHome = () => { history.replace({ pathname: "/"})};

    return <div className="con-80" style={{ marginLeft: "20%" }}>
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
                <MdHome className="hover" onClick={goHome}/>
            </div>
        </div>
        <Body />
    </div>
};

export default BodyRenderer;