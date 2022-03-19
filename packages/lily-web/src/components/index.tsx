export const MainContainer = (props: any) => {
    return <div className="body-container">
        {props.children}
    </div>
}

export const NavigationContainer = (props: any) => {
    return <div className="navigation-container">
        {props.children}
    </div>
}

export const BodyContainer = (props: any) => {
    return <div className="document-container">
        {props.children}
    </div>
}

export const DividerContainer = (props: any) => {
    return <div className="divider-container">
        {props.children}
    </div>
}

export const PagesNavContainer = (props: any) => {
    return <div className="pages-nav">
        {props.children}
    </div>
}

export const PageNavContainer = (props: any) => {
    return <div className="page-nav">
        {props.children}
    </div>
}

export const ChapterNavContainer = (props: any) => {
    return <div className="chapter-nav">
        {props.children}
    </div>
}

export const SectionsNavContainer = (props: any) => {
    return <div className="sections-nav">
        {props.children}
    </div>
}

export const SectionNavContainer = (props: any) => {
    return <div className="section-nav">
        {props.children}
    </div>
}

export const BodyViewContainer = (props: any) => {
    return <div className="">
        {props.children}
    </div>
}

export const DocumentViewContainer = (props: any) => {
    return <div className="document-view-container">
        {props.children}
    </div>
}

export const EditContainer = (props: any) => {
    const { deleteItem, deleteEvent, setDeleteItem } = props;
    const deleteButtons = () => {
        return <div>
            <button onClick={() => {
                deleteEvent();
            }}>
                Delete
            </button>
            <button onClick={() => {
                setDeleteItem({
                    deleteId: null
                })
            }}>
                Cancel
            </button>
        </div>
    }
    return <div className={`edit-view-container ${deleteItem.deleteId ? 'delete-view-container' : null}`}>
        {props.children}
        {deleteItem.deleteId ? deleteButtons() : null}
    </div>
}

export const SubSectionsViewContainer = (props: any) => {
    return <div>
        {props.children}
    </div>
}

export const SubSectionViewContainer = (props: any) => {
    return <div className="subSection-view-container">
        {props.children}
    </div>
}

export const EditTitleContainer = (props: any) => {
    return <div className="edit-title-container">
        {props.children}
    </div>
}

export const EditTitle = (props: any) => {
    return <div className="edit-title">
        {props.children}
    </div>
}

export const EditTitleIcons = (props: any) => {
    return <div className="edit-title-icons">
        {props.children}
    </div>
}

export const AddChapterUpperContainer = (props: any) => {
    return <div className="add-chapter-upper-container">
        {props.children}
    </div>
}

export const AddSectionUpperContainer = (props: any) => {
    return <div className="add-section-upper-container">
        {props.children}
    </div>
}

export const AddSectionInnerContainer = (props: any) => {
    return <div className="add-section-inner-container">
        {props.children}
    </div>
}

export const Container = (props: any) => {
    return <>
        {props.children}
    </>
}

export const PageTitleContainer = (props: any) => {
    return <div className="page-title">
        {props.children}
    </div>
}

export const SectionTitleContainer = (props: any) => {
    return <div className="section-title">
        {props.children}
    </div>
}