const CreateBodyComponent = (props: any) => {
    return (
        <div style={{display: "flex", flexDirection: "row"}}>
            <div className="navbar-left">{props.leftComponent}</div>
            <div className="home-page-container">
                <div>{props.children}</div>
            </div>
        </div>
    );
};

export default CreateBodyComponent;
