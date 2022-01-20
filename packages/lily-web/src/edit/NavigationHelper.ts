const usePageTitle = (props: any, context: any) => {
    const { dispatch } = context;
    const { page } = props;
    const setActivePage = (e: any) => {
        e.preventDefault();
        dispatch({
            type: 'ACTIVE_PAGE',
            pageId: page.uniqueId,
        });
    };
    return [page, setActivePage];
}

const useSections = (props: any) => {
    const { page } = props;
    let sections = [];
    if (page.child && Array.isArray(page.child) && page.child.length > 0) {
        sections = page.child;
    }
    return [sections];
}

const useSection = (props: any) => {
    const { page, context, section } = props;
    const { dispatch } = context;
    const setSection = (e: any) => {
        e.preventDefault();
        dispatch({
            type: 'ACTIVE_PAGE',
            pageId: page.uniqueId,
            sectionId: section.uniqueId,
        })
    }
    return [ section, setSection ];
}

const useMain = (context: any) => {
    const { apiData, dispatch } = context;
    const pages = JSON.parse(JSON.stringify(apiData)); 
    return [pages, {dispatch}];
}

export {
    usePageTitle,
    useSection,
    useSections,
    useMain,
}