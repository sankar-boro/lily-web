import { Result, Ok, Err } from "ts-results";
import axios from "axios";
import { sortAll } from "lily-service";
import { BOOK_SERVICE } from "lily-types";

const log = false;
const UPDATE_OR_DELETE = "http://localhost:8000/book/update_or_delete";

const updateOrDelete = async (data: {
  deleteData: any,
  updateData: any,
}, bookId: string) => {

  if (log) {
    console.log(data);
    return;
  }

  await axios.post(UPDATE_OR_DELETE, {
    bookId,
    json: JSON.stringify(data),
  }, {
    withCredentials: true,
  })
  .then((res: any) => {
    console.log(data);
    return res;
  });
}

export const deleteSection = async (bookContext: any) => {
    const { apiData, dispatch, activePage: activeSection, bookId, rawData } = bookContext;
    if (!activeSection) return Err("");
        
    const deleteIds: any[] = [];
    
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

    let updateData: any = null;
    let deleteData = deleteIds;

    if (parentData && childData) {
        updateData = {
            topUniqueId: parentData.uniqueId,
            botUniqueId: childData.uniqueId
        }
    };

    await updateOrDelete({updateData, deleteData}, bookId);

    let newRawData = rawData.filter((node: any) => {
      if (deleteIds.includes(node.uniqueId)) return false;
      return true;
    });

    if (updateData && updateData.topUniqueId && updateData.botUniqueId) {
        newRawData = newRawData.map((node: any) => {
          if (node.uniqueId === updateData.botUniqueId) {
            return { ...node, parentId: updateData.topUniqueId };
          }
          return node;
        })
    }

    const newApiData = sortAll(newRawData, deleteData);

    let newActivePage = null;
    newApiData.forEach((page: any) => {
        if (page.uniqueId === bookId) {
          newActivePage = page;
        }
    });

    dispatch({
      type: BOOK_SERVICE.SETTERS,
      setters: [
        {
          key: 'rawData',
          value: newRawData
        },
        {
          key: 'apiData',
          value: newApiData,
        },
        {
          key: 'activePage',
          value: newActivePage
        }
      ]
    })
    
    return Ok(deleteData)
}

export const deleteSubSection = async (context:any, subSection: any) => {
    const { activePage, bookId, rawData, dispatch } = context;
    const section = activePage;
    let totalSubSections = section.child.length;    
  	let parentData = section;
  	let childData = null;
    let subSections = section.child;
    const deleteData = [subSection.uniqueId];

    for (let i=0; i < totalSubSections; i++) {
        if (!subSections[i] || !subSections[i].uniqueId) return Err(`no data for index ${i}`);
        if (subSections[i].uniqueId === subSection.uniqueId) {
            if (subSections[i + 1]) {
                childData = subSections[i + 1];
            }
            break;
        }
        parentData = subSections[i];
    }

    let updateData: any = null;

    if (parentData && childData) {
      updateData = {
        topUniqueId: parentData.uniqueId,
        botUniqueId: childData.uniqueId
      }
    };
    
    await updateOrDelete({updateData, deleteData}, bookId);

    let newRawData = rawData.filter((node: any) => {
      if (node.uniqueId === subSection.uniqueId) return false;
      return true;
    });

    if (updateData && updateData.topUniqueId && updateData.botUniqueId) {
        newRawData = newRawData.map((node: any) => {
          if (node.uniqueId === updateData.botUniqueId) {
            return { ...node, parentId: updateData.topUniqueId };
          }
          return node;
        })
    }

    const newApiData = sortAll(newRawData, deleteData);

    let newActivePage = null;
    newApiData.forEach((page: any) => {
        page.child.forEach((currentSection: any) => {
            if (currentSection.uniqueId === section.uniqueId) {
                newActivePage = currentSection;
            }
        })
    });

    dispatch({
      type: BOOK_SERVICE.SETTERS,
      setters: [
        {
          key: 'rawData',
          value: newRawData
        },
        {
          key: 'apiData',
          value: newApiData
        },
        {
          key: 'activePage',
          value: newActivePage
        }
      ]
    })

    return Ok("Deleted")
}

export const deletePage = async (context: any) => {
  const {activePage, apiData, bookId, dispatch, rawData } = context;
  if (!apiData) return Err("!apiData");
  if (!activePage) return Err("!activePage");
  
  if (activePage.length === 1) return Err('Cannot delete');

  const deleteIds: any[] = [];

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
    if (apiData[i].uniqueId === activePageId) {
      if (apiData[i+1]) {
        childData = apiData[i + 1];
      }
      break;
    }
    parentData = apiData[i];
  }

  let updateData: any = null;
  let deleteData = deleteIds;

  if (parentData && childData) {
    updateData = {
      topUniqueId: parentData.uniqueId,
      botUniqueId: childData.uniqueId
    }
  };

  await updateOrDelete({updateData, deleteData}, bookId);

  let newRawData = rawData.filter((node: any) => {
    if (deleteIds.includes(node.uniqueId)) return false;
    return true;
  });

  if (updateData && updateData.topUniqueId && updateData.botUniqueId) {
      newRawData = newRawData.map((node: any) => {
        if (node.uniqueId === updateData.botUniqueId) {
          return { ...node, parentId: updateData.topUniqueId };
        }
        return node;
      })
  }

  const newApiData = sortAll(newRawData, deleteData);

  let newActivePage = null;
  newApiData.forEach((page: any) => {
      if (page.uniqueId === bookId) {
        newActivePage = page;
      }
  });

  dispatch({
    type: BOOK_SERVICE.SETTERS,
    setters: [
      {
        key: 'rawData',
        value: newRawData,
      },
      {
        key: 'apiData',
        value: newApiData,
      },
      {
        key: 'activePage',
        value: newActivePage
      }
    ]
  })

  return Ok("Success.");
}
