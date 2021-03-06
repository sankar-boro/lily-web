import { useBlogContext } from "lily-service";
import {
    SubSection,
    BlogContextType,
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
import { editBlog, DeleteBlog, createNewNodeBlog } from "lily-utils";
import { useHistory } from "react-router";

const FormView = (props: any) => {
    const { vue } = props;
    const context: BlogContextType = useBlogContext();
    if (vue.isForm) {
        return <MarkDownForm context={context} />;
    }
    return null;
};

const Title = (props: any) => {
    const { node } = props;
    if (node.identity === 101) {
        return <h1>{node.title}</h1>
    }
    return <h3>{node.title}</h3>
}

const createMethods = (context: BlogContextType, node: any, history: any) => {
    return {
        __delete: async () => {
            await DeleteBlog(context, node, history)
        },
        __create: () => {
            createNewNodeBlog(context, node)
        },
        __edit: () => {
            editBlog(context, node)
        }
    }
}

const NodeComponent = ({ node }: { node: any}) => {
    const context: BlogContextType = useBlogContext();
    const history = useHistory();
    const { __delete, __create, __edit } = createMethods(context, node, history);

    return <SubSectionViewContainer>
        <EditTitleContainer>
            <EditTitle>
                <Title node={node} />
            </EditTitle>
            <EditTitleIcons>
                <span 
                className="edit-click hover" 
                onClick={__edit}>
                    Edit
                </span>
                <span className="delete-click hover" onClick={__delete}>Delete</span>
            </EditTitleIcons>
        </EditTitleContainer>
        <div className="description">
            <MarkdownPreview.Markdown source={node.body} />
        </div>
        <div 
            className="add-item li-item hover"
            style={{ display: 'flex', justifyContent: 'center'}}
            onClick={__create}
        >
            + Add node
        </div>
    </SubSectionViewContainer>
}

const ActivePageChildComponents = ({context}: {context: BlogContextType }) => {
    const { apiData }: any = context;

    return <SubSectionsViewContainer>
        {apiData.map((node: SubSection, subSectionIndex: number) => {
            return <NodeComponent node={node} key={subSectionIndex} />
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

const BodyComponent = () => {
    const context: BlogContextType = useBlogContext();
    const { vue, apiData } = context;
    if (vue.isForm) return <FormComponent vue={vue} />
    if (vue.isDoc && apiData) {
        return <BodyViewContainer>
            <SearchInputComponent />
            <DocumentViewContainer>
                <ActivePageChildComponents context={context} />
            </DocumentViewContainer>
        </BodyViewContainer>
    }
    return null;
}

export default BodyComponent;