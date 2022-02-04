import { sortAll } from "lily-service";
import { BOOK_SERVICE, Page, Common, ApiData, Section, RawData, SubSection, BookContextType, ActivePage } from "lily-types";
import { updateOrDelete } from "lily-query";

type ActivePageInfo = {
	activePageIdentity: number;
	activePageUId: string, // activePageUniqueId
	activePageNodes: any[], // activePageChildNodes
	activePageNodesLen: number, // activePageChildNodesLen
	parentData: any, // parentData
};
type Keys = string[];
type Values = [RawData, ApiData, ActivePage];

const __dispatch = (fn: any, keys: Keys, values: Values) => {
	console.log('keys', keys);
	console.log('values', values);
	fn({
		type: BOOK_SERVICE.SETTERSV1,
		settersv1: { keys, values }
	})
}

const __activePageInfo = (activePage: Section | Page): ActivePageInfo => {
	const { child, identity, ...parentData } = activePage;
	return {
		activePageIdentity: identity,
		activePageUId: activePage.uniqueId,
		activePageNodes: activePage.child,
		activePageNodesLen: activePage.child.length,
		parentData
	}
}

const __sectionChildIds = (section: Section): string[] => {
	let ids: string[] = [];
	section.child.forEach((n: SubSection) => {
		ids.push(n.uniqueId);
	})
	return ids;
}

const __pageChildIds = (page: Page): string[] => {
	let deleteIds: string[] = [];
	page.child.forEach((section: Section) => {
		deleteIds.push(section.uniqueId);
		deleteIds = deleteIds.concat(__sectionChildIds(section));
	});
	return deleteIds;
}

const TopBotId = () => {
	let topData: any = null;
	let botData: any = null;
	const final = () => {
		if (topData && botData) {
			return {
				topUniqueId: topData.uniqueId,
				botUniqueId: botData.uniqueId
			}
		}
		return null;
	}
	return {
		page: (apiData: ApiData, activePage: Page) => {
			if (!activePage) return null;
			const { uniqueId: deletePageId } = activePage;
			topData = apiData[0];
			for (let i = 1; i < apiData.length; i++) {
				if (apiData[i].uniqueId === deletePageId) {
					if (apiData[i+1]) {
						botData = apiData[i + 1];
					}
					break;
				}
				topData = apiData[i];
			}
			return final();
		},
		section: (apiData: ApiData, activePage: Page) => {
			if (!activePage) return null;
			const { uniqueId: deleteSectionId } = activePage;
			let break_ = false;
			for (let i = 1; i < apiData.length; i++) {
				const page: Page = apiData[i] as Page;
				const sections: Section[] = page.child;
				if (break_) break;
				for (let j = 0; j < sections.length; j++) {
					if (sections[j].uniqueId === deleteSectionId) {
						topData = page;
						if (sections[j + 1]) {
							botData = sections[j + 1];
						}
						break_ = true;
						break;
					}
					topData = sections[j];		
				}
			}
			return final();
		},
		subSection: (section: Section, deleteSubSectionId: string) => {
			topData = section;
			const subSections = section.child;
			for (let i = 1; i < subSections.length; i++) {
				if (subSections[i].uniqueId === deleteSubSectionId) {
					if (subSections[i + 1]) {
						botData = subSections[i + 1];
					}
					break;
				}
				topData = subSections[i];
			}
			return final();
		}
	}
}

type TopBotUIdType = { topUniqueId: string, botUniqueId: string };

const removeNodes = (rawData: RawData, nodes: string[] = []) => {
	return rawData.filter((node: Common) => {
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

const __init = (context: BookContextType) => {
	const { activePage, bookId, rawData, dispatch, apiData } = context;
	const activePageInfo: ActivePageInfo = __activePageInfo(activePage as Page | Section);
	const { activePageUId } = activePageInfo;
	return {
		dispatch: (k: Keys, v: Values) => __dispatch(dispatch, k, v),
		rawData,
		bookId,
		activePage,
		activePageUId,
		activePageInfo,
		deletePageData: () => [activePageUId, ...__pageChildIds(activePage as Page)],
		deleteSectionData: () => [activePageUId, ...__sectionChildIds(activePage as Section)],
		updatePageData: () => TopBotId().page(apiData as ApiData, activePage as Page),
		updateSectionData: () => TopBotId().section(apiData as ApiData, activePage as Page),
		updateSubSectionData: (id: string) => TopBotId().subSection(activePage as Section, id)
	}
}

export const deletePage = async (context: BookContextType) => {
  	const { bookId, dispatch, rawData, deletePageData, updatePageData } = __init(context);
	const deleteData: string[] = deletePageData();
	const updateData = updatePageData();
	await updateOrDelete({updateData, deleteData}, bookId as string);

	let _rawData: RawData = removeNodes(rawData as RawData, deleteData);
	if (updateData) _rawData = updateRawDataNodes(_rawData, updateData)

	const _apiData = sortAll(_rawData, deleteData);
	 
	let _activePage: Page | Section | Common | null = getActivePage(_apiData, bookId as string);
	 
	const keys: Keys = ['rawData', 'apiData', 'activePage'];
	const values: Values = [_rawData, _apiData, _activePage as Page]
	dispatch(keys, values);
}

export const deleteSection = async (context: BookContextType) => {
	const { bookId, rawData, dispatch, deleteSectionData, updateSectionData } = __init(context);
    const deleteData = deleteSectionData();
    let updateData = updateSectionData();
    
	await updateOrDelete({updateData, deleteData}, bookId as string);

    let _rawData = removeNodes(rawData as RawData, deleteData);
    if (updateData) _rawData = updateRawDataNodes(_rawData, updateData);
    
	const _apiData = sortAll(_rawData, []);
    
	let _activePage = getActivePage(_apiData, bookId as string);
    
	const keys: Keys = ['rawData', 'apiData', 'activePage'];
	const values: Values = [_rawData, _apiData, _activePage as Page]
	dispatch(keys, values);
}

export const deleteSubSection = async ({
	context,
	compareId
}: any) => {
	const { activePageUId, bookId, rawData, dispatch, updateSubSectionData } = __init(context);
	/** 
	 * @function update
	 * 
	*/
	let deleteData = [compareId];
	let updateData = updateSubSectionData(compareId);
	/** */
	await updateOrDelete({updateData, deleteData}, bookId as string);
	/** */
	let _rawData: RawData = removeNodes(rawData as RawData, deleteData);
	if (updateData) _rawData = updateRawDataNodes(_rawData, updateData);            // final:rawData
	/** */
	const _apiData: ApiData = sortAll(_rawData, []);                                         // final:apiData
	/** */
	let _activePage: Page | Section | Common | null = getActivePage(_apiData, activePageUId);                       // final:activePage
	/** */
	const keys: Keys = ['rawData', 'apiData', 'activePage'];
	const values: Values = [_rawData, _apiData, _activePage as Page]
	dispatch(keys, values);
}

