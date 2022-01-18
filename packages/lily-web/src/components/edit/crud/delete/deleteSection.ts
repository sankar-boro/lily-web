import axios from "axios";
import { Result, Ok, Err } from "ts-results";
import { ENV, URLS} from "../../../../globals/constants";

const updateOrDelete = (url: string, data: any) => {
    axios.post(url, data, {
        withCredentials: true,
    });
}

interface AdjacentData {
    parentData: any | null;
    nextData: any | null;
}

class DeleteSection {
    
    context: any = null;
    parent: any = null;
    activeSection: any = null;
    totalSections: number | null = null;
    sections: any = null;

    setContext(context: any) {
        this.context = context;
    }

    setActiveSectionDetails() {
        const { apiData, activePage } = this.context;
        let _parent = null;
        apiData.forEach((chapter: any) => {
            chapter.child.forEach((section: any) => {
                if (section.uniqueId === activePage.uniqueId) {
                    _parent = chapter;
                    this.totalSections = chapter.child.length;
                    this.sections = chapter.child;
                }
            });
        });
        this.activeSection = activePage;
        this.parent = _parent;
    }

    createDeleteIds() : Result<string[], string> {
        if (!this.activeSection) return Err("Could not delete Section. No data");
        if (!this.activeSection.uniqueId) return Err("Could not delete Section. No uniqueId.");

        const deleteIds = [];
        const { child, uniqueId } = this.activeSection;
        const subSections = child;

        subSections.forEach((subSection: any) => {
            deleteIds.push(subSection.uniqueId);
        });
        deleteIds.push(uniqueId);

        if (deleteIds.length === 0) return Err("Array empty. Nothing to delete");
        return Ok(deleteIds);
    }

    createAdjacentChaptersFromActivePage() : Result<AdjacentData, string> {
        const { parent, activeSection, totalSections, sections } = this;
        let parentData = parent;
        let nextData = null;

        let deleteType = null;
        if (!activeSection) return Err("activeSection not set");
        if(!activeSection.uniqueId) return Err("missing active section uniqueId.");

        if (totalSections) {
            let lastSectionIndex = totalSections - 1;
    
            for (let i=0; i <= lastSectionIndex; i++) {
                if (!sections[i]) return Err(`no data from index: ${i}`);
                if (sections[i].uniqueId === activeSection.uniqueId) {
                    if (sections[i+1]) {
                        deleteType = "deleteUpdate";
                        nextData = sections[i + 1];
                    } else {
                        deleteType = "deleteOnly";
                    }
                    break;
                }
                parentData = sections[i];
            }
        }

        if (!parentData) return Err("cannot delete page if parentPage does not exist.");

        // parentPage will never be null, nextPage could be null.
        return Ok({
            parentData,
            nextData
        });
    }
}

// interface AdjacentPages {
//     parentPage: any | null;
//     nextPage: any | null;
// }

interface AdjacentIds {
    nextChapterUId: string | null,
    parentChapterUId: string | null,
}

const getAdjacentIds = (pages: AdjacentData) => {
    const { parentData, nextData } = pages;
    let nextChapterUId = nextData ? nextData.uniqueId : null;
    let parentChapterUId = parentData ? parentData.uniqueId : null;
    return {
        nextChapterUId,
        parentChapterUId,
    }    
}

const adjacentIdsToTopAndBotIds = (ids: AdjacentIds) => {
    const { nextChapterUId, parentChapterUId } = ids;
    let updateData = null;
    if (nextChapterUId !== null && parentChapterUId !== null) {
        return {
            topUniqueId: parentChapterUId,
            botUniqueId: nextChapterUId,
        }
    }
    return updateData;
}

const deleteSection = (context: any) => {
    const { bookId } = context;
    let sectionData = new DeleteSection();
    sectionData.setContext(context);
    sectionData.setActiveSectionDetails();
    let _deleteIds: Result<string[], string> = sectionData.createDeleteIds();
    if (_deleteIds.err) {
        console.log(`Oops! Something went wrong. Error: ${_deleteIds.val}`);
        return;
    }
    let deleteIds = _deleteIds.unwrap();

    let adjacentPages: Result<AdjacentData, string> = sectionData.createAdjacentChaptersFromActivePage();
    if (adjacentPages.err) {
        console.log("Could not delete page. Cause: ", adjacentPages.val);
        return;
    }
    
    let adjacentIds = getAdjacentIds(adjacentPages.unwrap());
    let updateData = adjacentIdsToTopAndBotIds(adjacentIds);

    const deleteData = deleteIds;
    const toJson = JSON.stringify({
        updateData,
        deleteData,
        // deleteType,
    });
    const update_delete_data = {
        bookId,
        json: toJson,
    }
    
    // test logger
        if (ENV.LOG) {
            console.log(deleteIds);
            console.log({
                updateData,
                deleteData
            });
            return;
        }
    //

    updateOrDelete(URLS.UPDATE_OR_DELETE, update_delete_data);
}

export default deleteSection;