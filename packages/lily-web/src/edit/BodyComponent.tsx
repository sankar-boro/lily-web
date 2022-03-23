import { useBookContext } from "lily-service";
import { Delete } from "lily-utils";
import { editActivePage, editSubSection } from "lily-utils";
import {
    VUE,
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
    EditContainer,
    EditTitleIcons,
    SubSectionsViewContainer,
    SubSectionViewContainer 
} from "lily-web/components";
import MarkdownPreview from '@uiw/react-md-editor';
import { useState } from "react";
import { useHistory } from "react-router";
import { createSubSection } from "lily-utils";

const FormView = (props: any) => {
    const { vue } = props;
    if (vue.viewType === VUE.FORM) {
        return <MarkDownForm />;
    }
    return null;
};


const SubSectionComponent = ({ subSection }: { subSection: SubSection}) => {
    const context: BookContextType = useBookContext();
    const history = useHistory();
    const [deleteItem, setDeleteItem] = useState<any>({ deleteId: null });

    return <EditContainer 
            deleteItem={deleteItem} 
            setDeleteItem={setDeleteItem}
            deleteEvent={async () => {
                await Delete({
                    context,
                    data: subSection,
                    history,
                })
            }}
        >
        <SubSectionViewContainer>
            <EditTitleContainer>
                <EditTitle>
                    <h3>{subSection.title}</h3>
                </EditTitle>
                <EditTitleIcons>
                    <span className="edit-click hover" onClick={() => {
                        editSubSection(context, subSection)
                    }}>Edit</span>
                    <span className="delete-click hover" onClick={() => { setDeleteItem({deleteId: subSection.uniqueId})}}>Delete</span>
                </EditTitleIcons>
            </EditTitleContainer>
            <div className="description">
                <MarkdownPreview.Markdown source={subSection.body} />
            </div>
            <div 
                className="add-item li-item hover"
                style={{ display: 'flex', justifyContent: 'center'}}
                onClick={() => createSubSection(context, subSection)}
            >
                + Sub-section
            </div>
        </SubSectionViewContainer>
    </EditContainer>
}

const DeleteActivePageComponent = ({ context, setDeleteItem }: { context: BookContextType, setDeleteItem: any }) => {
    const { activePage } = context;
    if (!activePage) return null;

    return <span className="delete-click hover" onClick={() => {setDeleteItem({deleteId: activePage.uniqueId})}}>Delete</span>
}

const EditActivePageComponent = ({ context, activePage }: { context: BookContextType, activePage: Page | Section}) => {
    return <span className="edit-click hover" onClick={() => editActivePage(context, activePage)}>Edit</span>
}

const ActivePageChildComponents = ({activePage, context}: {activePage: Page | Section, context: BookContextType }) => {
    if (activePage.identity === 104) return null;

    return <SubSectionsViewContainer>
        <div 
            className="add-item li-item hover"
            style={{ display: 'flex', justifyContent: 'center'}}
            onClick={() => createSubSection(context, undefined)}
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

const Title = (props: { activePage: any }) => {
    const { activePage } = props;
    if (activePage.identity === 101) {
        return <h1 className="book-title">{activePage.title}</h1>
    }
    return <h1>{activePage.title}</h1>
}

const BodyComponent = () => {
    const context: BookContextType = useBookContext();
    const history = useHistory();
    const { activePage, vue } = context;
    const [deleteItem, setDeleteItem] = useState({ deleteId: null });

    if (vue.viewType === VUE.FORM) return <FormComponent vue={vue} />
    if (!activePage) return null;

    return <BodyViewContainer>
        <SearchInputComponent />
        <DocumentViewContainer>
            <EditContainer 
                deleteItem={deleteItem} 
                setDeleteItem={setDeleteItem}
                deleteEvent={async () => {
                    await Delete({
                        context,
                        data: activePage,
                        history
                    })
                }}
            >
                <EditTitleContainer>
                    <EditTitleContainer>
                        <Title activePage={activePage} />
                    </EditTitleContainer>
                    <EditTitleIcons>
                        <EditActivePageComponent context={context} activePage={activePage as Page | Section} />
                        <DeleteActivePageComponent context={context} setDeleteItem={setDeleteItem} />
                    </EditTitleIcons>
                </EditTitleContainer>
                <div className="description">
                    <MarkdownPreview.Markdown source={activePage.body} />
                </div>
                <ActivePageChildComponents context={context} activePage={activePage as Page | Section} />
            </EditContainer>
        </DocumentViewContainer>
    </BodyViewContainer>
}

export default BodyComponent;