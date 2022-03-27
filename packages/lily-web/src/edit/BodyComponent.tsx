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

    const { uniqueId, identity} = subSection;
    const __delete = async () => {
        await Delete({
            context,
            data: { uniqueId, identity },
            history
        })
    }
    return <SubSectionViewContainer>
        <EditTitleContainer>
            <EditTitle>
                <h3>{subSection.title}</h3>
            </EditTitle>
            <EditTitleIcons>
                <span className="edit-click hover" onClick={() => {
                    editSubSection(context, subSection)
                }}>Edit</span>
                <span className="delete-click hover" onClick={__delete}>Delete</span>
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
}

const DeleteActivePageComponent = ({ context }: { context: BookContextType }) => {
    const history = useHistory();
    const { activePage } = context;
    if (!activePage) return null;
    const { identity } = activePage;
    if (identity === 101) return null;

    const __delete = async () => {
        await Delete({
            context,
            data: activePage,
            history
        })
    }
    return <span className="delete-click hover" onClick={__delete}>Delete</span>
}

const EditActivePageComponent = ({ context, activePage }: { context: BookContextType, activePage: Page | Section}) => {
    return <span className="edit-click hover" onClick={() => editActivePage(context, activePage)}>Edit</span>
}

const ActivePageChildComponents = ({activePage, context}: {activePage: Page | Section, context: BookContextType }) => {
    const { identity } = activePage;
    if (identity < 105) return null;

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
    const { activePage, vue } = context;

    if (vue.viewType === VUE.FORM) return <FormComponent vue={vue} />
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
            <ActivePageChildComponents context={context} activePage={activePage as Page | Section} />
        </DocumentViewContainer>
    </BodyViewContainer>
}

export default BodyComponent;