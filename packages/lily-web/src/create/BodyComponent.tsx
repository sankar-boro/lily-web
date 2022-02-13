import { Delete } from "lily-components";
import { useBookContext } from "lily-service";
import { MdModeEdit, MdDelete } from 'react-icons/md';
import { 
    BOOK_SERVICE,
    FORM_TYPE,
    VUE,
    Section,
    DELETE,
    SubSection,
    BookContextType,
    Page
} from "lily-types";
import MarkDownForm from "lily-web/forms/MarkDownForm";
import { 
    BodyViewContainer,
    DocumentViewContainer,
    EditTitle,
    EditTitleContainer,
    EditTitleIcons,
    SubSectionsViewContainer,
    SubSectionViewContainer 
} from "lily-web/components";


const FormView = (props: any) => {
    const { state } = props;
    if (state === VUE.FORM) {
        return <MarkDownForm />;
    }
    return null;
};

const subSectionHandlers = (context: BookContextType, subSection: SubSection) => {
    const { dispatch } = context;
    return {
        __delete: async (e: any) => {
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
        },
        __edit: () => {
            dispatch({
                type: BOOK_SERVICE.SETTERS,
                setters: {
                    keys: ['formData', 'vue'],
                    values: [subSection, FORM_TYPE.UPDATE]
                }
            });
        }
    }
}

const SubSectionComponent = ({ subSection }: { subSection: SubSection}) => {
    const context: BookContextType = useBookContext();
    const { __delete, __edit } = subSectionHandlers(context, subSection);

    return <SubSectionViewContainer>
        <EditTitleContainer>
            <EditTitle>
                {subSection.title}
            </EditTitle>
            <EditTitleIcons>
                <MdModeEdit onClick={__edit}/>
                <MdDelete onClick={__delete}/>
            </EditTitleIcons>
        </EditTitleContainer>
        <div className="description">{subSection.body}</div>
    </SubSectionViewContainer>
}

const DeleteActivePageComponent = ({deletePage, deleteSection, identity}: any) => {
    if (identity === 104) return <MdDelete onClick={deletePage}/>
    if (identity === 105) return <MdDelete onClick={deleteSection}/>
    return null;
}

const ActivePageChildComponents = ({activePage}: {activePage: Page | Section }) => {
    if (activePage.identity === 104) return null;

    return <SubSectionsViewContainer>
        {activePage.child.map((subSection: SubSection, subSectionIndex: number) => {
            return <SubSectionComponent subSection={subSection} key={subSectionIndex} />
        })} 
    </SubSectionsViewContainer>
}

const SearchInputComponent = () => {
    return <div className="search-input-container">
        <input className="search-input" name="searchDocument" placeholder="Search"/>
    </div>
}

const bodyComponentHandler = (context: BookContextType) => {
    const { activePage, dispatch } = context;
    return {
        __editPage: () => dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: {
                keys: ['viewType', 'formData'],
                values: [FORM_TYPE.UPDATE, activePage]
            }
        }),
        __deletePage: () => {
            Delete({
                context,
                type: DELETE.PAGE
            });
        },
        __deleteSection: () => {
            Delete({
                context,
                type: DELETE.SECTION
            });
        },
    }
}

const BodyComponent = () => {
    const context: BookContextType = useBookContext();
    const { activePage, vue } = context;
    const { __editPage, __deletePage, __deleteSection } = bodyComponentHandler(context);

    if (vue === VUE.FORM) return <MarkDownForm />
    if (!activePage) return null;

    return <BodyViewContainer>
        <SearchInputComponent />
        <DocumentViewContainer>
            <EditTitleContainer>
                <EditTitleContainer>
                    <h3 className="h3">{activePage.title}</h3>
                </EditTitleContainer>
                <EditTitleIcons>
                    <MdModeEdit onClick={__editPage}/>
                    <DeleteActivePageComponent
                        deletePage={__deletePage}
                        deleteSection={__deleteSection}
                    />
                </EditTitleIcons>
            </EditTitleContainer>
            <div className="description">{activePage.body}</div>
            <ActivePageChildComponents activePage={activePage as Page | Section} />
        </DocumentViewContainer>
    </BodyViewContainer>
}

export default BodyComponent;