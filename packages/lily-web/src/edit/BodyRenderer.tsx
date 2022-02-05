import { useHistory } from "react-router-dom";
import { MdHome, MdModeEdit, MdSearch, MdDelete } from 'react-icons/md';
import { Delete } from "lily-components";

import Divider from "./Divider";
import { BookContextType, BOOK_SERVICE, constants, FORM_TYPE, VUE, Page, Section, DELETE, SubSection, ActivePage } from "lily-types";
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
        const act = {
            type: 'DELETE',
            data: {
                type: DELETE.SUB_SECTION,
                deleteProps: {
                    deleteId: subSection.uniqueId
                }
            }
        }
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['modal', 'activity'],
                values: [{ type: 'DELETE' }, act]
            }
        })
        // await Delete({
        //     context,
        //     type: DELETE.SUB_SECTION,
        //     deleteProps: {
        //         deleteId: subSection.uniqueId
        //     }
        // });
    }
    
    const __editSubSection = (subSection: any) => {
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
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
        {activePage.child.map((subSection: SubSection, subSectionIndex: number) => {
            return <SubSectionBody subSection={subSection} key={subSectionIndex} />
        })} 
    </>
}

const Body = () => {
    const context: BookContextType = useBookContext();
    const { vue, activePage, dispatch } = context;
    
    if (activePage === null) return <></>;

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
                <Divider />
            </div>
        );
    }

    const Edit = () => {
        const edit = () => dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['viewType', 'formData'],
                values: [FORM_TYPE.UPDATE, activePage]
            }
        })

        return <MdModeEdit onClick={edit}/>
    }
    
    return <div className="con-80" style={{ marginLeft: "20%" }}>
        <div className="flex">
            <div className="con-80 flex">
                <div className="con-10" />
                <div className="con-80">
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
    </div>
}


export default Body;