import { sortAll } from "lily-utils";
import { Page, Common, ApiData, Section, RawData, SubSection, BookContextType, ActivePage, Chapter } from "lily-types";
import { DELETE_BOOK, updateOrDelete, postNoDataQuery } from "lily-query";

type Keys = string[];
type Values = [RawData, ApiData, ActivePage, any];

const __dispatch = (fn: any, keys: Keys, values: Values) => {
	fn({ keys, values })
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

const getUpdateData = () => {
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
		page: (apiData: ApiData, deletePageId: string) => {
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
			/**
			 * For section delete we do not loop through sub-sections.
			 * 
			 */
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
			topData = section; // init topUniqueId
			const subSections = section.child;
			for (let i = 0; i < subSections.length; i++) {
				/** 
				 * If current subSectionId is deleteId, check if next subSection exist.
				 */
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

type DeleteParams = {
	context: BookContextType,
	data: any,
	history: any,
}

const Run = (context: BookContextType, deleteData: string[], updateData: TopBotUIdType | null) => {
	const { rawData, bookId, dispatch, activePage } = context;
	const { uniqueId } = activePage as Page | Chapter | Section | SubSection;
	let _rawData: RawData = removeNodes(rawData as RawData, deleteData);
	if (updateData) _rawData = updateRawDataNodes(_rawData, updateData)
	const _apiData = sortAll(_rawData, deleteData);
	let _activePage: ActivePage | null = getActivePage(_apiData, deleteData.includes(uniqueId) ? bookId as string : uniqueId as string);
	const keys: Keys = ['rawData', 'apiData', 'activePage', 'modal'];
	const values: Values = [_rawData, _apiData, _activePage as Page, null]
	__dispatch(dispatch, keys, values);
}

const DeletePage = async (
	context: BookContextType
) => {
	const { activePage, apiData, bookId, rawData, dispatch } = context;
	if (!activePage || !apiData) return;
	const deleteData: string[] = [activePage.uniqueId, ...__pageChildIds(activePage as Page)];
	const updateData = getUpdateData().page(apiData as ApiData, activePage.uniqueId);
	const deleteItems = rawData && rawData.filter((d: any) => deleteData.includes(d.uniqueId))
	const callBack = async () => {
		await updateOrDelete({updateData, deleteData}, bookId as string);
		Run(context, deleteData, updateData);
	}
	dispatch({
		keys: ['modal'],
		values: [{
			title: 'You are about to delete a Page that contains following Sections and Sub Sections.',
			body: deleteItems,
			delete: callBack
		}]
	})
}

const DeleteSection = async (
	context: BookContextType
) => {
	const { activePage, apiData, bookId, rawData, dispatch } = context;
	if (!activePage || !apiData) return;
	const { uniqueId } = activePage;
	const deleteData = [uniqueId, ...__sectionChildIds(activePage as Section)];
	let updateData = getUpdateData().section(apiData as ApiData, activePage as Page);
	const deleteItems = rawData && rawData.filter((d: any) => deleteData.includes(d.uniqueId))
	const callBack = async () => {
		await updateOrDelete({updateData, deleteData}, bookId as string);
		Run(context, deleteData, updateData);
	}
	dispatch({
		keys: ['modal'],
		values: [{
			title: 'You are about to delete a Section that contains following Sub Sections.',
			body: deleteItems,
			delete: callBack
		}]
	})
}



const DeleteSubSection = async (
	context: BookContextType,
	node: any
) => {
	const { activePage, bookId, dispatch, rawData } = context;
	const { uniqueId } = node;
	let deleteData = [uniqueId];
	const deleteItems = rawData && rawData.filter((d: any) => deleteData.includes(d.uniqueId))
	const onDeleteSubSectionConfirm = async () => {
		if (!uniqueId) return;
		let updateData = getUpdateData().subSection(activePage as Section, uniqueId);
		await updateOrDelete({updateData, deleteData}, bookId as string);
		Run(context, deleteData, updateData);
	}
	dispatch({
		keys: ['modal'],
		values: [{
			title: 'Are you sure you want to delete Section.',
			body: deleteItems,
			delete: onDeleteSubSectionConfirm
		}]
	})
}

const DeleteBook = async (context: BookContextType, deleteId: string, history: any) => {
	const { dispatch } = context;
	dispatch({
		keys: ['modal'],
		values: [{
			title: 'Are you sure you want to delete Book.',
			body: [],
			delete: async () => {
				const url = DELETE_BOOK(deleteId);
				await postNoDataQuery({url});
				history.push("/");
			}
		}]
	})
}

export const Delete = async (
	context: BookContextType,
	data: any,
	history: any
) => {
	const { uniqueId, identity } = data;
	if (identity === 101) {
		await DeleteBook(context, uniqueId, history);
	} else if (identity === 104) {
		await DeletePage(context);
	} else if (identity === 105) {
		await DeleteSection(context);
	} else if (identity ===106) {
		await DeleteSubSection(context, data);
	}
}
