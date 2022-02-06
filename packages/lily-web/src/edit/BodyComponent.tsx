import { Delete } from "lily-components";
import { useBookContext } from "lily-service";
import { MdModeEdit, MdDelete } from 'react-icons/md';
import { BOOK_SERVICE, FORM_TYPE, VUE, Section, DELETE, SubSection, BookContextType } from "lily-types";
import AllForm from "lily-web/forms/AllForm";
import { BodyViewContainer, DocumentViewContainer, EditTitle, EditTitleContainer, EditTitleIcons, SubSectionsViewContainer, SubSectionViewContainer } from "lily-web/components";


const FormView = (props: any) => {
    const { state } = props;
    if (state === VUE.FORM) {
        return <AllForm />;
    }
    return null;
};

const SubSectionComponent = (props: { subSection: SubSection }) => {
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

    return <SubSectionViewContainer>
        <EditTitleContainer>
            <EditTitle>
                {subSection.title}
            </EditTitle>
            <EditTitleIcons>
                <MdModeEdit onClick={__editSubSection}/>
                <MdDelete onClick={__deleteSubSection}/>
            </EditTitleIcons>
        </EditTitleContainer>
        <div className="description">{subSection.body}</div>
    </SubSectionViewContainer>
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

const ActivePageChildComponents = () => {
    const { activePage }: BookContextType = useBookContext();
    if (!activePage) return null;
    const _activePage = activePage as Section;
    const { child, identity } = _activePage;
    if (identity === 104) return null;
    const subSections = child;

    return <SubSectionsViewContainer>
        {subSections.map((subSection: SubSection, subSectionIndex: number) => {
            return <SubSectionComponent subSection={subSection} key={subSectionIndex} />
        })} 
    </SubSectionsViewContainer>
}

const SearchInputComponent = () => {
    return <div className="search-input-container">
        <input className="search-input" name="searchDocument" placeholder="Search"/>
    </div>
}

const BodyComponent = () => {
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
    
    return <BodyViewContainer>
        <SearchInputComponent />
        <DocumentViewContainer>
            <EditTitleContainer>
                <EditTitleContainer>
                    <h3 className="h3">{activePage.title}</h3>
                </EditTitleContainer>
                <EditTitleIcons>
                    <Edit />
                    <DeleteBody 
                        context={context}
                        identity={activePage.identity}
                    />
                </EditTitleIcons>
            </EditTitleContainer>
            <div className="description">{activePage.body}</div>
            <ActivePageChildComponents />
        </DocumentViewContainer>
    </BodyViewContainer>
}

export default BodyComponent;