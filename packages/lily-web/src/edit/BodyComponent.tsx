import { useBookContext } from "lily-service";
import { Delete } from "lily-utils";
import { editActivePage, editSubSection } from "lily-utils";

import {
    VUE,
    Section,
    SubSection,
    BookContextType,
    Page,
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
                title: NODE_TYPE.SUB_SECTION,
                delete: async () => {
                    await Delete({
                        context,
                        event: {
                            action: 'delete',
                            deleteId: subSection.uniqueId,
                            nodeType: NODE_TYPE.SUB_SECTION
                        }
                    })
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

const DeleteActivePageComponent = ({ context }: { context: BookContextType }) => {
    const { activePage } = context;
    if (!activePage) return null;
    const { identity } = activePage;
    const { __deletePage, __deleteSection } = bodyComponentHandler(context);

    if (identity === 101) return <span className="delete-click hover" onClick={__deletePage}>Delete Book</span>
    if (identity === 104) return <span className="delete-click hover" onClick={__deletePage}>Delete</span>
    if (identity === 105) return <span className="delete-click hover" onClick={__deleteSection}>Delete</span>
    return null;
}

const EditActivePageComponent = ({ context, activePage }: { context: BookContextType, activePage: Page | Section}) => {
    return <span className="edit-click hover" onClick={() => editActivePage(context, activePage)}>Edit</span>
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
        __deletePage: () => {
            dispatcher?.setModal({
                title: NODE_TYPE.PAGE,
                delete: async () => {
                    await Delete({
                        context,
                        event: {
                            action: 'delete',
                            deleteId: activePage?.uniqueId,
                            nodeType: NODE_TYPE.PAGE
                        }
                    })
                }
            })
        },
        __deleteSection: () => {
            dispatcher?.setModal({
                title: NODE_TYPE.SECTION,
                delete: async () => {
                    await Delete({
                        context,
                        event: {
                            action: 'delete',
                            deleteId: activePage?.uniqueId,
                            nodeType: NODE_TYPE.SECTION
                        }
                    })
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

    if (vue.viewType === VUE.FORM) return <FormComponent vue={vue} />
    
    if (!activePage) return null;

    return <BodyViewContainer>
        <SearchInputComponent />
        <DocumentViewContainer>
            <EditTitleContainer>
                <EditTitleContainer>
                    <h2 className="h3">{activePage.title}</h2>
                </EditTitleContainer>
                <EditTitleIcons>
                    <EditActivePageComponent context={context} activePage={activePage as Page | Section} />
                    <DeleteActivePageComponent context={context} />
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