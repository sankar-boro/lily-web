import axios from "axios";
import { Result, Ok, Err, Some, None, Option } from "ts-results";

import { Page, Book } from "../../../../utils/delete";
import { ENV, URLS} from "../../../../globals/constants";
import { Chapter, ApiData, ChapterChildNode, ChapterParentNode } from "../../../../globals/types";

const updateOrDelete = (data: any, bookId: string) => {
    if (ENV.LOG) {
        console.log(data);
        return;
    }
    axios.post(URLS.UPDATE_OR_DELETE, {
        bookId,
        json: JSON.stringify(data),
    }, {
        withCredentials: true,
    });
}

type AdjacentPageData = {
    topPageData: Option<ChapterParentNode>;
    botPageData: Option<ChapterChildNode>;
}

type AdjacentPageId = {
    topPageUId: Option<string>,
    botPageUId: Option<string>,
}

type TopAndBotId =  {
    topUniqueId: string | null,
    botUniqueId: string | null,
}

class DeletePage {

    activePage: Chapter;
    apiData: ApiData;
    sections: Option<any[]> = None;
    activePageId: Option<string> = None;

    deletePageIds: Option<string[]> = None;
    updatePageData: Option<AdjacentPageData> = None;

    constructor(apiData: ApiData, activePage: Chapter) {
        this.apiData = apiData;
        this.activePage = activePage;
    }

    private createDeleteIds(activePage: Chapter) {
        let deletePageIds: string[] = [];
        Page(activePage).allIdsFromPage(deletePageIds)
        this.deletePageIds = Some(deletePageIds); // ids include [pageId, sectionId, subSectionId]
    }

    private createAdjacentDataFromActivePage(apiData: ApiData) : Result<string, string> {
        
        let totalPages = apiData.length;
        if (totalPages <= 1) return Err("Cannot delete chapter.");

        let updateData = Book(apiData).getAdjacentFromPage(this.activePageId.unwrap());

        if (updateData.err) {
            return Err(updateData.val);
        }
        
        let updateData1 = updateData.unwrap();
        if (updateData1.some) {
            let updateData2 = updateData1.unwrap();            
            this.updatePageData = Some({
                topPageData: updateData2.parentNode,
                botPageData: updateData2.childNode,
            });
        }
        return Ok("success");
    }

    init(): Result<string, string> {
        const { activePage } = this;
        if (!activePage.uniqueId) return Err("!uniqueId");
        this.activePageId = Some(activePage.uniqueId);

        if (!activePage.child) return Err("!activePage.child");
        this.sections = Some(activePage.child);

        return Ok("Success.");
    }

    run(): Result<string, string> {
        const init = this.init();
        if (init.err) return init;

        let { apiData, activePage } = this;
        this.createDeleteIds(activePage);

        const adjacentIds =  this.createAdjacentDataFromActivePage(apiData);
        if (adjacentIds.err) return adjacentIds;
        return Ok("Success.");
    }

    getData() : Result<any, string> {
        
        let adjacentIds: Result<Option<AdjacentPageId>, string> = Ok(None);
        let topAndBotIds: Option<TopAndBotId> = None;

        if (this.updatePageData.some) {
            adjacentIds = getAdjacentIds(this.updatePageData.val);
            if (adjacentIds.err) return adjacentIds;
        }

        let _adjacentIds = adjacentIds.val;
        if(_adjacentIds.none) {
            const returnData = {
                deleteData: this.deletePageIds,
                updateData: null,
            };
            return Ok(returnData);    
        }

        topAndBotIds = adjacentIdsToTopAndBotIds(_adjacentIds.val);
        return Ok({
            deleteData: this.deletePageIds,
            updateData: topAndBotIds,
        }); 

    }
}

const getAdjacentIds = (adjacentPageData: AdjacentPageData): Result<Option<AdjacentPageId>, string> => {
    const { topPageData, botPageData } = adjacentPageData;
    if (topPageData.none) return Err("!topPageData");
    if (topPageData.some && botPageData.none) return Ok(None);

    let topPageUId = topPageData.some && topPageData.val.uniqueId ? Some(topPageData.val.uniqueId) : None;
    let botPageUId = botPageData.some && botPageData.val.uniqueId ? Some(botPageData.val.uniqueId) : None;
    return Ok(Some({
        topPageUId,
        botPageUId,
    }));    
}

const adjacentIdsToTopAndBotIds = (ids: AdjacentPageId): Option<TopAndBotId> => {
    const { botPageUId, topPageUId } = ids;
    if (!botPageUId && !topPageUId) return None;

    return Some({
        topUniqueId: topPageUId.some ? topPageUId.val : null,
        botUniqueId: botPageUId.some ? botPageUId.val : null,
    });
}

const deletePage = (context: any): Result<string, string> => {
    const {activePage, apiData, bookId} = context;
    if (!apiData) return Err("!apiData");
    if (!activePage) return Err("!activePage");

    const deletePage = new DeletePage(apiData, activePage);
    const runRes = deletePage.run();
    if( runRes.err) return runRes;
    
    let json = deletePage.getData();
    if (json.err) return json;

    updateOrDelete(json, bookId);
    return Ok("Success.");
}


export default deletePage;