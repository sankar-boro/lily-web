import axios from "axios";
import { sortAll } from "lily-service";
import { BOOK_SERVICE, Page, Common, ApiData, Section, RawData } from "lily-types";

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

const createDeleteSectionIds = (activeSection: Section, deleteIds: string[]) => {
    activeSection.child.forEach((subSection: any) => {
        deleteIds.push(subSection.uniqueId);
    });
}

const createSectionTopAndBotId = (apiData: ApiData, activePage: ActivePageInfo) => {
	const { activePageUId } = activePage;

	let topData: any = null;
	let botData: any = null;
	let sections: any = null;
	let totalSections: any = null;

	apiData.forEach((chapter: any) => {
		chapter.child.forEach((section: any) => {
			if (section.uniqueId === activePageUId) {
			 	topData = chapter;
				sections = chapter.child;
				totalSections = sections.length;
			}
		});
	});

	if (sections && totalSections) {
        for (let i=0; i < totalSections; i++) {
            if (sections[i].uniqueId === activePageUId) {
                if (sections[i + 1]) {
                    botData = sections[i + 1];
                }
                break;
            }
	        topData = sections[i];
        }
    }

	if (topData && botData) {
		return {
		  topUniqueId: topData.uniqueId,
		  botUniqueId: botData.uniqueId
		};
	};
	return null;
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

const removeNodes = (rawData: RawData, nodes: any[] = []) => {
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

const getActivePage = (apiData: ApiData, compareId: string) => {
	let newActivePage = null;
	for (let i=0; i < apiData.length; i++) {
		let page: Common | Page = apiData[i];
		if (apiData[i].uniqueId === compareId) {
			newActivePage = apiData[i];
			break;
		}
		const typeOfPage = (x: any): x is Page => !!x.child; 
		if (typeOfPage(page)) {
			const sections = page.child;
			for (let j=0; j < sections.length; j++) {
				if (sections[j].uniqueId === compareId) {
					newActivePage = sections[j];
					break;
				}
			}
		}
	}
	return newActivePage;
}

const createDeletePageIds = (activePage: Page, deleteIds: any[]) => {
	activePage.child.forEach((section: any) => {
		deleteIds.push(section.uniqueId);
		section.child.forEach((subSection: any) => {
			deleteIds.push(subSection.uniqueId);
		});
	});
}

const createPageTopBotUId = (apiData: ApiData, activePageUId: string): null | TopBotUIdType => {
	const totalChapters = apiData.length;
	let childData: any = null;
	let parentData: any = null;
	for (let i=0; i < totalChapters; i++) {
		if (apiData[i].uniqueId === activePageUId) {
			if (apiData[i+1]) {
				childData = apiData[i + 1];
			}
			break;
		}
		parentData = apiData[i];
	}
	if (parentData && childData) {
		return {
			topUniqueId: parentData.uniqueId,
			botUniqueId: childData.uniqueId
		}
	};
	return null;
}

export const deletePage = async (context: any) => {
  	const { activePage, apiData, bookId, dispatch, rawData } = context;
	const __activePageInfo: ActivePageInfo = activePageInfo(activePage);
	const { activePageUId } = __activePageInfo;
	const deleteData: any[] = [activePageUId];
	createDeletePageIds(activePage, deleteData);
	const updateData = createPageTopBotUId(apiData, activePageUId);
	await updateOrDelete({updateData, deleteData}, bookId);
	let newRawData = removeNodes(rawData, deleteData);
	if (updateData) newRawData = updateRawDataNodes(rawData, updateData)
	const newApiData = sortAll(newRawData, deleteData);
	let newActivePage = getActivePage(newApiData, activePageUId);
	dispatch({
		type: BOOK_SERVICE.SETTERSV1,
		settersv1: {
			keys: ['rawData', 'apiData', 'activePage'],
			values: [newRawData, newApiData, newActivePage]
		}
	})
}


export const deleteSection = async (bookContext: any) => {
    const { apiData, dispatch, activePage, bookId, rawData } = bookContext;
	const __activePageInfo: ActivePageInfo = activePageInfo(activePage);
	const { activePageUId } = __activePageInfo;
    const deleteData: any[] = [activePageUId];
    createDeleteSectionIds(activePage, deleteData);
    let updateData = createSectionTopAndBotId(apiData, activePage);
    await updateOrDelete({updateData, deleteData}, bookId);
    let newRawData = removeNodes(rawData, deleteData);
    if (updateData) newRawData = updateRawDataNodes(newRawData, updateData);
    const newApiData = sortAll(newRawData, []);
    let newActivePage = getActivePage(newApiData, bookId);
    dispatch({
      type: BOOK_SERVICE.SETTERSV1,
      settersv1: {
		  keys: ['rawData', 'apiData', 'activePage'],
		  values: [newRawData, newApiData, newActivePage]
	  }
    })
}

export const deleteSubSection = async ({
	context,
	compareId
  }: any) => {
	  const { activePage, bookId, rawData, dispatch } = context;
	  const __activePageInfo: ActivePageInfo = activePageInfo(activePage);
	  const { activePageUId } = __activePageInfo;
	  let deleteData = [compareId];
	  let updateData: null | TopBotUIdType = TopBotUId(__activePageInfo, compareId);
	  await updateOrDelete({updateData, deleteData}, bookId);
	  let RawData = removeNodes(rawData, deleteData);                               // :rawData
	  if (updateData) RawData = updateRawDataNodes(RawData, updateData);
	  const ApiData = sortAll(RawData, []);                                         // :apiData
	  let ActivePage = getActivePage(ApiData, activePageUId);                       // :activePage
	  dispatch({
			type: BOOK_SERVICE.SETTERSV1,
			settersv1: {
			  keys: ['rawData', 'apiData', 'activePage'],
			  values: [RawData, ApiData, ActivePage]
			}
	  })
  }