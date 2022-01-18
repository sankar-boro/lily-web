import deletePage from "./deletePage";
import deleteSection from "./deleteSection";
import deleteSubSection from "./deleteSubSection";

export default class Data {
    parent: any = null;
    context: any = null;
    apiData: any = null;
    activePage: any = null;
    activeSection: any = null;

    inner: any = null;
    length: any = null;
    section: any = [];
    isTrue = false;

    constructor() {
        return this;
    }

    setContext(context: any) {
        this.context = context;
    }

    setApiData(apiData: any) {
        this.apiData = apiData;
    }

    setActivePage(activePage: any) {
        this.activePage = activePage;
    }

    setActiveSection() {
        const { apiData, activePage } = this.context;
        let _parent = null;
        apiData.forEach((chapter: any) => {
            chapter.child.forEach((section: any) => {
                if (section.uniqueId === activePage.uniqueId) {
                    _parent = chapter;
                }
            });
        });
        this.activeSection = activePage;
        this.parent = _parent;
    }
}

export {
    deletePage,
    deleteSection,
    deleteSubSection
}