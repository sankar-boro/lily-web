import { useHistory } from "react-router-dom";
import { MdHome, MdModeEdit, MdSearch, MdDelete } from 'react-icons/md';
import { Delete } from "lily-components";

import Divider from "./Divider";
import { BookContextType, BOOK_SERVICE, constants, FORM_TYPE, VUE, Page, Section, SubSection, DELETE } from "lily-types";
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

const SubSectionBody = (props: { subSection: SubSection }) => {
    const { subSection } = props;
    const context: BookContextType = useBookContext();
    const { dispatch } = context;

    const __deleteSubSection = async (e: any) => {
        e.preventDefault();
        await Delete({
            context,
            type: DELETE.SUB_SECTION,
            deleteProps: {
                deleteId: subSection.uniqueId
            }
        });
    }
    
    const __editSubSection = (subSection: any) => {
        dispatch({
            type: BOOK_SERVICE.SETTERSV1,
            settersv1: {
                keys: ['formData', 'vue'],
                values: [subSection, FORM_TYPE.UPDATE]
            }
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
                <MdModeEdit onClick={__editSubSection}/>
                <MdDelete onClick={__deleteSubSection}/>
            </div>
        </div>
        <div className="description">{subSection.body}</div>
    </div>
}

const DeleteBody = (props: {
    context: BookContextType,
    identity: number
}) => {
    const { context, identity } = props;
    const _deletePage = (e: any) => {
        e.preventDefault();
        Delete({
            context,
            type: DELETE.PAGE
        });
    };
    const _deleteSection = (e: any) => {
        e.preventDefault();
        Delete({
            context,
            type: DELETE.SECTION
        });
    };
    if (identity === 104) return <MdDelete onClick={_deletePage}/>
    if (identity === 105) return <MdDelete onClick={_deleteSection}/>
    return null;
}

const SectionBody = (props: { activePage: Section }) => {
    const { activePage } = props;
    if (activePage.identity === 104) return null;
    return <>
        {activePage.child.map((subSection: any, subSectionIndex: number) => {
            return <SubSectionBody subSection={subSection} key={subSectionIndex} />
        })}
    </>
}

const Body = () => {
    const context: any = useBookContext();
    const { vue, activePage, dispatch } = context;

    if (!activePage) return <AllForm />;
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

    const Edit = () => {
        const edit = () => dispatch({
            type: BOOK_SERVICE.SETTERSV1,
            settersv1: {
                keys: ['viewType', 'formData'],
                values: [FORM_TYPE.UPDATE, activePage]
            }
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
                <SectionBody activePage={activePage as Section} />
            </div>
            <div className="con-10" />
        </div>
        <Divider />
    </div>
}

const BodyRenderer = () => {
    const history: any = useHistory();
    const context: any = useBookContext();
    const { apiData: _apiDAta, activePage } = context;
    const goHome = () => { history.replace({ pathname: "/"})};

    const title = activePage ? activePage.title : null;
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