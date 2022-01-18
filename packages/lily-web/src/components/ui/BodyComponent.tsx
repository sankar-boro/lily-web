import { useHistory } from "react-router";
import { MdHome, MdModeEdit } from 'react-icons/md';

const BodyComponent = (props: any) => {
    const history = useHistory();
    const { bookId, allPages, header } = props;
    return (
        <div style={{display:"flex", flexDirection: "row"}}>
            <div className="navbar-left">{props.leftComponent}</div>
            <div className="body-container">
                <div className="toolbar">
                    <div className="document-categories"></div>
                    <div className="read-header">{header}</div>
                    <div className="settings div-inline">
                        <div className="inline-item hover" onClick={(e) => {
                                e.preventDefault();
                                history.replace({
                                    pathname: `/`,
                                });
                            }}>
                            <MdHome />
                        </div>
                        <div
                            className="inline-item hover"
                            onClick={(e) => {
                                e.preventDefault();
                                history.replace({
                                    pathname: `/book/edit/${bookId}`,
                                    state: {
                                        main: history.location.state,
                                        allPages,
                                    },
                                });
                            }}
                        >
                            <MdModeEdit />
                        </div>
                    </div>
                </div>
                <div>{props.children}</div>
            </div>
        </div>
    );
};

export default BodyComponent;
