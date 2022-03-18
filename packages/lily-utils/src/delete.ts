import { sortAll } from "lily-utils";
import { BOOK_SERVICE, Page, Common, ApiData, Section, RawData, SubSection, BookContextType, ActivePage, Chapter } from "lily-types";
import { updateOrDelete } from "lily-query";

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
			for (let i = 0; i < subSections.length; i++) {
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
	event: any,
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
	const { activePage, apiData, bookId } = context;
	if (!activePage || !apiData) return;
	const deleteData: string[] = [activePage.uniqueId, ...__pageChildIds(activePage as Page)];
	const updateData = TopBotId().page(apiData as ApiData, activePage as Page);
	await updateOrDelete({updateData, deleteData}, bookId as string);
	Run(context, deleteData, updateData);
}

const DeleteSection = async (
	context: BookContextType
) => {
	const { activePage, apiData, bookId } = context;
	if (!activePage || !apiData) return;
	const { uniqueId } = activePage;
	const deleteData = [uniqueId, ...__sectionChildIds(activePage as Section)];
	let updateData = TopBotId().section(apiData as ApiData, activePage as Page);			
	await updateOrDelete({updateData, deleteData}, bookId as string);
	Run(context, deleteData, updateData);
}

const DeleteSubSection = async (
	context: BookContextType,
	event: any
) => {
	const { activePage, bookId } = context;
	const { deleteId } = event;
	if (!deleteId) return;
	let deleteData = [deleteId];
	let updateData = TopBotId().subSection(activePage as Section, deleteId);
	await updateOrDelete({updateData, deleteData}, bookId as string);
	Run(context, deleteData, updateData);
}

export const Delete = async ({
	context,
	event
}: DeleteParams) => {
	const { nodeType } = event;

	if (nodeType === 'PAGE') {
		await DeletePage(context);
	} else if (nodeType === 'SECTION') {
		await DeleteSection(context);
	} else if (nodeType === 'SUB_SECTION') {
		await DeleteSubSection(context, event);
	}
}
