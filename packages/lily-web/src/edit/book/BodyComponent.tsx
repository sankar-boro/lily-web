import { useBookContext } from "lily-service";
import { Delete } from "lily-utils";
import { editActivePage, editSubSection } from "lily-utils";
import {
    Section,
    SubSection,
    BookContextType,
    Page,
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
import { useHistory } from "react-router";
import { createSubSection } from "lily-utils";

const FormView = (props: any) => {
    const { vue } = props;
    const context: BookContextType = useBookContext();

    if (vue.isForm) {
        return <MarkDownForm context={context} />;
    }
    return null;
};

const createMethods = (context: BookContextType, node: any, history: any) => {
    return {
        __delete: async () => {
            await Delete(context,node,history)
        },
        __create: () => {
            createSubSection(context, node)
        },
        __edit: () => {
            editSubSection(context, node);
        }
    }
}

const SubSectionComponent = ({ subSection }: { subSection: SubSection}) => {
    const context: BookContextType = useBookContext();
    const history = useHistory();
    const { __create, __delete, __edit} = createMethods(context, subSection, history);

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
        <div 
            className="add-item li-item hover"
            style={{ display: 'flex', justifyContent: 'center'}}
            onClick={__create}
        >
            + Sub-section
        </div>
    </SubSectionViewContainer>
}

const DeleteActivePageComponent = ({ context }: { context: BookContextType }) => {
    const history = useHistory();
    const { activePage } = context;
    if (!activePage) return null;
    const { identity } = activePage;
    if (identity === 101) return null;

    const __delete = async () => {
        await Delete(context,activePage,history)
    }
    return <span className="delete-click hover" onClick={__delete}>Delete</span>
}

const EditActivePageComponent = ({ context, activePage }: { context: BookContextType, activePage: Page | Section}) => {
    const __edit = () => {
        editActivePage(context, activePage)
    }
    return <span className="edit-click hover" onClick={__edit}>Edit</span>
}

const ActivePageChildComponents = ({context}: {context: BookContextType }) => {
    const { activePage }: any = context;
    if (!activePage) return null;
    const { identity } = activePage as Page | Section;
    if (identity < 105) return null;

    const __create = () => {
        createSubSection(context, undefined)
    }

    return <SubSectionsViewContainer>
        <div 
            className="add-item li-item hover"
            style={{ display: 'flex', justifyContent: 'center'}}
            onClick={__create}
        >
            + Sub-section
        </div>
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

export const FormComponent = (vue: any) => {
    return (
        <BodyViewContainer>
            <SearchInputComponent />
            <DocumentViewContainer>
                <FormView {...vue} />
            </DocumentViewContainer>
        </BodyViewContainer>
    );
}

const Title = (props: { activePage: any }) => {
    const { activePage } = props;
    if (activePage.identity === 101) {
        return <h1 className="book-title">{activePage.title}</h1>
    }
    return <h1>{activePage.title}</h1>
}

const BodyComponent = () => {
    const context: BookContextType = useBookContext();
    const { activePage, vue } = context;

    if (vue.isForm) return <FormComponent vue={vue} />
    if (!activePage) return null;

    return <BodyViewContainer>
        <SearchInputComponent />
        <DocumentViewContainer>
            <EditTitleContainer>
                <EditTitleContainer>
                    <Title activePage={activePage} />
                </EditTitleContainer>
                <EditTitleIcons>
                    <EditActivePageComponent context={context} activePage={activePage as Page | Section} />
                    <DeleteActivePageComponent context={context}/>
                </EditTitleIcons>
            </EditTitleContainer>
            <div className="description">
                <MarkdownPreview.Markdown source={activePage.body} />
            </div>
            <ActivePageChildComponents context={context} />
        </DocumentViewContainer>
    </BodyViewContainer>
}

export default BodyComponent;