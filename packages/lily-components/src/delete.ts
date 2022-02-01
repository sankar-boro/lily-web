import { Result, Ok, Err } from "ts-results";
import axios from "axios";
import { sortAll } from "lily-service";
import { BOOK_SERVICE, Page } from "lily-types";

const log = false;
const UPDATE_OR_DELETE = "http://localhost:8000/book/update_or_delete";

const updateOrDelete = async (data: {
  deleteData: any,
  updateData: any,
}, bookId: string) => {

  if (log) {
    return;
  }

  await axios.post(UPDATE_OR_DELETE, {
    bookId,
    json: JSON.stringify(data),
  }, {
    withCredentials: true,
  })
  .then((res: any) => {
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

type ActivePageInfo = {
	activePageUId: string, // activePageUniqueId
	activePageNodes: any[], // activePageChildNodes
	activePageNodesLen: number, // activePageChildNodesLen
	parentData: any, // parentData
};


const activePageInfo = (activePage: Page): ActivePageInfo => {
	const { child, ...parentData } = activePage;
	return {
		activePageUId: activePage.uniqueId,
		activePageNodes: activePage.child,
		activePageNodesLen: activePage.child.length,
		parentData
	}
}

type TopBotUIdType = { topUniqueId: string, botUniqueId: string };

const TopBotUId = (activePageInfo: ActivePageInfo, compareId: string): null | TopBotUIdType => {
	const { activePageNodes, activePageNodesLen, parentData } = activePageInfo;
	let botData = null;
	let topData = parentData;
	for (let i=0; i < activePageNodesLen; i++) {
        if (activePageNodes[i].uniqueId === compareId) {
            if (activePageNodes[i + 1]) {
                botData = activePageNodes[i + 1];
            }
            break;
        }
        topData = activePageNodes[i];
    }
	if (topData && botData) {
		return {
		  topUniqueId: topData.uniqueId,
		  botUniqueId: botData.uniqueId
		};
	};
	return null;
}

const removeNodes = (rawData: any[] = [], nodes: any[] = []) => {
	return rawData.filter((node: any) => {
		if (nodes.includes(node.uniqueId)) return false;
      	return true;
	});
}

const updateRawDataNodes = (rawData: any[] = [], updateData: TopBotUIdType) => {
	const { topUniqueId, botUniqueId } = updateData;
	return rawData.map((node: any) => {
		if (node.uniqueId === botUniqueId) {
		  return { ...node, parentId: topUniqueId };
		}
		return node;
	})
}

const newActivePage = (apiData: any, compareId: string) => {
	let newActivePage = null;
	apiData.forEach((page: any) => {
        page.child.forEach((currentSection: any) => {
            if (currentSection.uniqueId === compareId) {
                newActivePage = currentSection;
            }
        })
    });
	return newActivePage;
}

export const deleteSubSection = async ({
  context,
  compareId
}: any) => {
    const { activePage, bookId, rawData, dispatch } = context;
	const __activePageInfo = activePageInfo(activePage);
	const { activePageUId } = __activePageInfo;
	let deleteData = [compareId];
    let updateData: null | TopBotUIdType = TopBotUId(__activePageInfo, compareId);
	await updateOrDelete({updateData, deleteData}, bookId);
    let RawData = removeNodes(rawData, deleteData);                               // :rawData
    if (updateData) {
        RawData = updateRawDataNodes(RawData, updateData);
    }

    const ApiData = sortAll(RawData, []);                                         // :apiData
    let ActivePage = newActivePage(ApiData, activePageUId );                      // :activePage

    dispatch({
      type: BOOK_SERVICE.SETTERSV1,
      settersv1: {
		keys: ['rawData', 'apiData', 'activePage'],
		values: [RawData, ApiData, ActivePage]
	  }
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
