import { Result, Ok, Err } from "ts-results";
import axios from "axios";

const log = true;
const UPDATE_OR_DELETE = "http://localhost:8000/book/update_or_delete";

export const deleteSection = (bookContext: any) => {
    const { apiData, activePage: activeSection, bookId } = bookContext;
    if (!activeSection) return Err("");
        
    const deleteIds = [];
    
    deleteIds.push(activeSection.uniqueId);
    activeSection.child.forEach((subSection: any) => {
        deleteIds.push(subSection.uniqueId);
    });
    
    let parentData = null;
    let sectionsLenOfChapter: number | null = null;
    let sectionsOfChapter: any = null;
    let childData = null;

    apiData.forEach((chapter: any) => {
        chapter.child.forEach((section: any) => {
            if (section.uniqueId === activeSection.uniqueId) {
                parentData = chapter;
                sectionsLenOfChapter = chapter.child.length;
                sectionsOfChapter = chapter.child;
            }
        });
    });


    if (sectionsOfChapter && sectionsLenOfChapter) {
        let lastSectionIndex = sectionsLenOfChapter - 1;
    
        for (let i=0; i <= lastSectionIndex; i++) {
            if (sectionsOfChapter[i].uniqueId === activeSection.uniqueId) {
                if (sectionsOfChapter[i+1]) {
                    childData = sectionsOfChapter[i + 1];
                }
                break;
            }
            parentData = sectionsOfChapter[i];
        }
    }

    let updateData = null;
    let deleteData = deleteIds;

    if (parentData && childData) {
        updateData = {
            topUniqueId: parentData.uniqueId,
            botUniqueId: childData.uniqueId
        }
    };

    updateOrDelete({updateData, deleteData}, bookId);
    
    return Ok('')
}

export const deleteSubSection = (props: any) => {

}

const updateOrDelete = (data: any, bookId: string) => {
  if (log) {
    console.log(data);
    return;
  }
  axios.post(UPDATE_OR_DELETE, {
    bookId,
    json: JSON.stringify(data),
  }, {
    withCredentials: true,
  });
}

export const deletePage = (context: any): Result<string, string> => {
  const {activePage, apiData, bookId} = context;
  if (!apiData) return Err("!apiData");
  if (!activePage) return Err("!activePage");
  
  if (activePage.length === 1) return Err('Cannot delete');

  const deleteIds = [];

  activePage.child.forEach((section: any) => {
    deleteIds.push(section.uniqueId);
    section.child.forEach((subSection: any) => {
      deleteIds.push(subSection.uniqueId);
    });
  });
  deleteIds.push(activePage.uniqueId);

  const totalChapters = apiData.length;
  const activePageId = activePage.uniqueId;
  let childData: any = null;
  let parentData: any = null;

  for (let i=0; i < totalChapters; i++) {
    if (!apiData[i]) return Err(`!apiData[i]`);
    if (!apiData[i].uniqueId) return Err(`!apiData[i].uniqueId`);
    if (apiData[i].uniqueId === activePageId) {
      if (apiData[i+1]) {
        childData = apiData[i + 1];
      }
      break;
    }
    parentData = apiData[i];
  }

  let updateData = null;
  let deleteData = deleteIds;

  if (parentData && childData) {
    updateData = {
      topUniqueId: parentData.uniqueId,
      botUniqueId: childData.uniqueId
    }
  };

  updateOrDelete({updateData, deleteData}, bookId);

  return Ok("Success.");
}
