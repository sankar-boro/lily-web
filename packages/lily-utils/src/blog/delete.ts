import { Common, ApiData, RawData, BlogContextType } from "lily-types";
import { DELETE_BLOG, updateOrDeleteNode, postNoDataQuery } from "lily-query";
import { sortBlog } from "../utils";

type Keys = string[];
type Values = [RawData, ApiData, any];

const __dispatch = (fn: any, keys: Keys, values: Values) => {
	fn({ keys, values })
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

const Run = (context: BlogContextType, deleteData: string[], updateData: TopBotUIdType | null) => {
	const { rawData, dispatch } = context;
	let _rawData: RawData = removeNodes(rawData as RawData, deleteData);
	if (updateData) _rawData = updateRawDataNodes(_rawData, updateData)
	const _apiData = sortBlog(_rawData, deleteData);
	const keys: Keys = ['rawData', 'apiData', 'modal'];
	const values: Values = [_rawData, _apiData, null]
	__dispatch(dispatch, keys, values);
}

const TopBotId = (apiData: any[], node: any) => {
	let topUniqueId = null;
	let botUniqueId = null;

	topUniqueId = apiData[0].uniqueId;

	for (let i=0; i < apiData.length; i++) {
		if (apiData[i].uniqueId === node.uniqueId) {
			if (apiData[i + 1]) {
				botUniqueId = apiData[i + 1].uniqueId;
			}
			break;
		}
		topUniqueId = apiData[i].uniqueId;
	}

	if (!botUniqueId) return null;
	return { topUniqueId, botUniqueId };
}

const DeleteNode = async (
	context: BlogContextType,
	node: any,
) => {
	const { apiData, blogId, rawData, dispatch } = context;
	if (!apiData) return;
	const deleteData: string[] = [node.uniqueId];
	const updateData = TopBotId(apiData, node);
	const deleteItems = rawData && rawData.filter((d: any) => deleteData.includes(d.uniqueId))
	console.log(deleteItems);
	dispatch({
		keys: ['modal'],
		values: [{
			title: 'Are you sure you want to delete node',
			body: deleteItems,
			delete: async () => {
				await updateOrDeleteNode({updateData, deleteData}, blogId as string);
				Run(context, deleteData, updateData);
			}
		}]
	})
}

const DeleteBlog = async (context: BlogContextType, deleteId: string, history: any) => {
	const { dispatch } = context;
	dispatch({
		keys: ['modal'],
		values: [{
			title: 'Are you sure you want to delete Blog.',
			body: [],
			delete: async () => {
				const url = DELETE_BLOG(deleteId);
				await postNoDataQuery({url});
				history.push("/");
			}
		}]
	})
}

export const deleteBlog = async ({
	context,
	data,
	history
}: any) => {
	const { uniqueId, identity } = data;
	if (identity === 101) {
		await DeleteBlog(context, uniqueId, history);
	} else if (identity === 102) {
		await DeleteNode(context, data);
	}
}
