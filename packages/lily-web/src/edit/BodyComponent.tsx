import { useBookContext } from "lily-service";
import { MdModeEdit, MdDelete } from 'react-icons/md';
import {
    VUE,
    Section,
    SubSection,
    BookContextType,
    Page,
    HTTP_METHODS,
    NODE_TYPE
} from "lily-types";
import MarkDownForm from "lily-web/forms";
import { 
    BodyViewContainer,
    DocumentViewContainer,
    EditTitle,
    EditTitleContainer,
    EditTitleIcons,
    SubSectionsViewContainer,
    SubSectionViewContainer 
} from "lily-web/components";
import MarkdownPreview from '@uiw/react-md-editor';
import { editActivePage, editSubSection } from "./utils";


const FormView = (props: any) => {
    const { vue } = props;
    if (vue.viewType === VUE.FORM) {
        return <MarkDownForm />;
    }
    return null;
};

const subSectionHandlers = (context: BookContextType, subSection: SubSection) => {
    const { dispatcher } = context;
    return {
        __delete: async (e: any) => {
            e.preventDefault();   
            dispatcher?.setModal({
                show: true,
                action: 'delete',
                data: {
                    deleteId: subSection.uniqueId,
                    nodeType: NODE_TYPE.SUB_SECTION
                }
            })
        },
        __edit: () => {
            editSubSection(context, subSection);
        }
    }
}

const SubSectionComponent = ({ subSection }: { subSection: SubSection}) => {
    const context: BookContextType = useBookContext();
    const { __delete, __edit } = subSectionHandlers(context, subSection);

    return <SubSectionViewContainer>
        <EditTitleContainer>
            <EditTitle>
                <h3>{subSection.title}</h3>
            </EditTitle>
            <EditTitleIcons>
                <span className="edit-click hover" onClick={__edit}>Edit</span>
                <span className="delete-click hover" onClick={__delete}>Delete</span>
            </EditTitleIcons>
        </EditTitleContainer>
        <div className="description">
            <MarkdownPreview.Markdown source={subSection.body} />
        </div>
    </SubSectionViewContainer>
}

const DeleteActivePageComponent = ({deletePage, deleteSection, identity}: any) => {
    if (identity === 104) return <span className="delete-click hover" onClick={deletePage}>Delete</span>
    if (identity === 105) return <span className="delete-click hover" onClick={deleteSection}>Delete</span>
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
    const { activePage, dispatcher } = context;
    return {
        __editPage: () => {
            editActivePage(context, activePage as Page | Section)
        },
        __deletePage: () => {
            dispatcher?.setModal({
                show: true,
                action: 'delete',
                data: {
                    nodeType: NODE_TYPE.PAGE
                }
            })
        },
        __deleteSection: () => {
            dispatcher?.setModal({
                show: true,
                action: 'delete',
                data: {
                    nodeType: NODE_TYPE.SECTION
                }
            })
        },
    }
}

const FormComponent = (vue: any) => {
    return (
        <BodyViewContainer>
            <SearchInputComponent />
            <DocumentViewContainer>
                <FormView {...vue} />
            </DocumentViewContainer>
        </BodyViewContainer>
    );
}

const BodyComponent = () => {
    const context: BookContextType = useBookContext();
    const { activePage, vue } = context;
    const { __editPage, __deletePage, __deleteSection } = bodyComponentHandler(context);

    if (!activePage) return null;
    if (vue.viewType === VUE.FORM) return <FormComponent vue={vue} />

    return <BodyViewContainer>
        <SearchInputComponent />
        <DocumentViewContainer>
            <EditTitleContainer>
                <EditTitleContainer>
                    <h2 className="h3">{activePage.title}</h2>
                </EditTitleContainer>
                <EditTitleIcons>
                    <span className="edit-click hover" onClick={__editPage}>Edit</span>
                    <DeleteActivePageComponent
                        deletePage={__deletePage}
                        deleteSection={__deleteSection}
                        identity={activePage.identity}
                    />
                </EditTitleIcons>
            </EditTitleContainer>
            <div className="description">
                <MarkdownPreview.Markdown source={activePage.body} />
            </div>
            <ActivePageChildComponents activePage={activePage as Page | Section} />
        </DocumentViewContainer>
    </BodyViewContainer>
}

export default BodyComponent;