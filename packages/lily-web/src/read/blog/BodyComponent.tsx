import { useBlogContext } from "lily-service";
import { BlogContextType, Section, SubSection } from "lily-types";
import MarkdownPreview from '@uiw/react-md-editor';
import { BodyViewContainer, DocumentViewContainer, SubSectionsViewContainer, SubSectionViewContainer } from "lily-web/components";

const ActivePageChildComponents = () => {
    const { apiData }: BlogContextType = useBlogContext();
    if (!apiData) return null;

    return <SubSectionsViewContainer>
        {apiData.map((node: any) => {
            return (
                <SubSectionViewContainer key={node.uniqueId}>
                    <h4 className="h4" id={node.uniqueId}>{node.title}</h4>
                    <div className="description">
                        <MarkdownPreview.Markdown source={node.body} />
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

const BodyComponent = () => {
    return <BodyViewContainer>
        <SearchInputComponent />
        <DocumentViewContainer>
            <ActivePageChildComponents />
        </DocumentViewContainer>
    </BodyViewContainer>
}

export default BodyComponent;