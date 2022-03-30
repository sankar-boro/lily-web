import { useBlogContext } from "lily-service";
import { BlogContextType, Section, SubSection } from "lily-types";
import MarkdownPreview from '@uiw/react-md-editor';
import { BodyViewContainer, DocumentViewContainer, SubSectionsViewContainer, SubSectionViewContainer } from "lily-web/components";

const Title = (props: any) => {
    const { node } = props;
    if (node.identity === 101) {
        return <div style={{ fontSize: 48, fontWeight: 700, color: "#454545", paddingTop: 20, paddingBottom: 20, borderBottom: "1px solid #ccc", marginBottom: 20 }}>{node.title}</div>
    }
    return <div style={{ fontSize: 24, fontWeight: "bold", color: "#454545", marginBottom: 15, marginTop: 35 }}>{node.title}</div>
}

const ActivePageChildComponents = () => {
    const { apiData }: BlogContextType = useBlogContext();
    if (!apiData) return null;

    return <SubSectionsViewContainer>
        {apiData.map((node: any) => {
            return (
                <SubSectionViewContainer key={node.uniqueId}>
                    <Title node={node} />
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