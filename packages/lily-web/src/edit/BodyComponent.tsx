import { Delete } from "lily-utils";
import { useBookContext } from "lily-service";
import { MdModeEdit, MdDelete } from 'react-icons/md';
import { 
    BOOK_SERVICE,
    VUE,
    Section,
    SubSection,
    BookContextType,
    Page,
    vueSetter,
    HTTP_METHODS,
    NODE_TYPE
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
import MarkdownPreview from '@uiw/react-md-editor';


const FormView = (props: any) => {
    console.log('props', props);
    const { vue } = props;
    if (vue.type === VUE.FORM) {
        return <MarkDownForm />;
    }
    return null;
};

const subSectionHandlers = (context: BookContextType, subSection: SubSection) => {
    const { dispatch, dispatcher } = context;
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
            vueSetter(context)
            .form(HTTP_METHODS.UPDATE, subSection);
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
        <div className="description">
            <MarkdownPreview.Markdown source={subSection.body} />
        </div>
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
        __editPage: () => {
            vueSetter(context)
            .form(HTTP_METHODS.UPDATE, activePage)
        },
        __deletePage: () => {
            Delete({
                context,
                type: NODE_TYPE.PAGE
            });
        },
        __deleteSection: () => {
            Delete({
                context,
                type: NODE_TYPE.SECTION
            });
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
    if (vue.type === VUE.FORM) return <FormComponent vue={vue} />

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