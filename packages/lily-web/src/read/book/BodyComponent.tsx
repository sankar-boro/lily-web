import { useBookContext } from "lily-service";
import { BookContextType, Section, SubSection } from "lily-types";
import MarkdownPreview from '@uiw/react-md-editor';
import { BodyViewContainer, DocumentViewContainer, SubSectionsViewContainer, SubSectionViewContainer } from "lily-web/components";

const ActivePageChildComponents = () => {
    const { activePage }: BookContextType = useBookContext();
    if (!activePage) return null;
    const _activePage = activePage as Section;
    const { child, identity } = _activePage;
    if (identity === 104) return null;
    const subSections = child;

    return <SubSectionsViewContainer>
        {subSections.map((subSection: SubSection) => {
            return (
                <SubSectionViewContainer key={subSection.uniqueId}>
                    <h4 className="h4" id={subSection.uniqueId}>{subSection.title}</h4>
                    <div className="description">
                        <MarkdownPreview.Markdown source={subSection.body} />
                    </div>
                </SubSectionViewContainer>
            );
        })}
    </SubSectionsViewContainer>
}

const SearchInputComponent = () => {
    return <div className="con-100">
        <input className="search-input" name="searchDocument" placeholder="Search"/>
    </div>
}

const Title = (props: { activePage: any }) => {
    const { activePage } = props;
    if (activePage.identity === 101) {
        return <h1 className="book-title">{activePage.title}</h1>
    }
    return <h1>{activePage.title}</h1>
}

const BodyComponent = () => {
    const context: any = useBookContext();
    const { activePage } = context;
    if (activePage === null) return null;
    
    return <BodyViewContainer>
        <SearchInputComponent />
        <DocumentViewContainer>
            <div>
                <Title activePage={activePage} />
                <div className="description">
                    <MarkdownPreview.Markdown source={activePage.body} />
                </div>
                <ActivePageChildComponents />
            </div>
        </DocumentViewContainer>
    </BodyViewContainer>
}

export default BodyComponent;