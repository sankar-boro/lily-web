import axios, { AxiosError, AxiosResponse } from "axios";
import { Result, Ok, Err } from "ts-results";


const UPDATE_OR_DELETE = "http://localhost:8000/book/update_or_delete";
const test = false;

const updateOrDelete = (url: string, data: any) => {
    axios.post(url, data, {
        withCredentials: true,
    });
}

interface AdjacentData {
    parentData: any | null;
    nextData: any | null;
}

class DeleteSubSection {
    
    section = null;
    totalSubSections = null;
    subSections = [];
    parentData = null;

    setSection(section: any) {
        this.section = section;
    }

    setSubSectionDetails(section: any, subSection: any) : Result<AdjacentData, string> {
        if (!section) return Err("Cannot delete Sub Section. No data: section");
        if (!subSection || !subSection.uniqueId) return Err("Cannot delete Sub Section. No data: subSection");
        if (!section.child) return Err("Cannot delete Sub Section. No data: section.child");
        if (!Array.isArray(section.child)) return Err("Cannot delete Sub Section. sub section is not an array.");
        
        let totalSubSections = section.child.length;
        
        let parentData = section;
        let nextData = null;
        let deleteType = null;

        this.totalSubSections = totalSubSections;
        let subSections = section.child;

        for (let i=0; i < totalSubSections; i++) {
            if (!subSections[i] || !subSections[i].uniqueId) return Err(`no data for index ${i}`);
            if (subSections[i].uniqueId === subSection.uniqueId) {
                if (subSections[i + 1]) {
                    deleteType = "deleteUpdate";
                    nextData = subSections[i + 1];
                } else {
                    deleteType = "deleteOnly";
                }
                break;
            }
            parentData = subSections[i];
        }

        this.parentData = parentData;
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

const deleteSubSection = (props: any) => {
    const { bookId, section, subSection } = props;
    let sectionData = new DeleteSubSection();
    let _updateData: Result<AdjacentData,string> = sectionData.setSubSectionDetails(section, subSection);
    if (_updateData.err) {
        console.log(`Oops! Something went wrong. Error: ${_updateData.val}`);
        return;
    }
    let adjacentIds = getAdjacentIds(_updateData.unwrap());
    let updateData = adjacentIdsToTopAndBotIds(adjacentIds);

    const deleteData = [subSection.uniqueId];
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
        if (test) {
            console.log('s', section.uniqueId);
            section.child.forEach((subSection: any) => {
                console.log('ss', subSection.uniqueId);
            });
            console.log({
                updateData,
                deleteData
            });
            return;
        }
    //

    updateOrDelete(UPDATE_OR_DELETE, update_delete_data);
}

export default deleteSubSection;