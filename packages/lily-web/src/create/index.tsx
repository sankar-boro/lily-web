import CreateBook from "../forms/CreateNewBook";

export default function FormView() {
    return <div style={{display: "flex", flexDirection: "row"}}>
        <div className="navbar-left" />
        <div className="home-page-container">
            <CreateBook />
        </div>
    </div>
};

