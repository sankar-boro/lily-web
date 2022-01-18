import { FORM_TYPE } from "../../../../globals/types";

const createChapter = (props: any) => {
    const { page, pageIndex, context } = props;
    const { apiData, dispatch } = context;
    if (!apiData && !apiData[pageIndex]) return;
    console.log(props);
    const lastPageIndex = apiData.length - 1;
    
    if (pageIndex === lastPageIndex) {
        dispatch({
            type: 'FORM_PAGE_SETTER',
            viewType: FORM_TYPE.CHAPTER,
            payload: {
                parentId: page.uniqueId,
                identity: 104,
            }
        });
    } else {
        if (!apiData && !apiData[pageIndex]) return;
        const topUniqueId = apiData[pageIndex].uniqueId;
        const botUniqueId = apiData[pageIndex + 1].uniqueId;
        dispatch({
            type: 'FORM_PAGE_SETTER',
            viewType: FORM_TYPE.CREATE_UPDATE,
            payload: {
                topUniqueId,
                botUniqueId,
                identity: 104,
            }
        });
    }
};

export {
    createChapter
}