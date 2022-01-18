import { Ok, Err, Option, Some, None, Result } from "ts-results";

import { UniqueId } from ".";
import { Section } from "./section";
import { Chapter as ChapterData, ApiData, ParentChildNode, ChapterParentNode, ChapterChildNode } from "../../globals/types";

class PageHandler {
    private node: ChapterData;
    
    constructor(chapter: ChapterData) {
        this.node = chapter;
    }

    allIdsFromPage(ids: UniqueId[]) {
        ids.push(this.node.uniqueId); // page id
        this.node.child.forEach((section) => {
            Section(section).allIdsFromSection(ids);
        });
    }
}

export function Page(chapter: ChapterData) {
    return new PageHandler(chapter);
}

class BookHandler {
    node: ApiData
    length: number;

    constructor(apiData: ApiData) {
        this.node = apiData;
        this.length = apiData.length;
    }

    getAdjacentFromPage(activePageId: string): Result<Option<ParentChildNode>, string> {
        const { node } = this;
        let parentNode: Option<ChapterParentNode> = None;
        let childNode: Option<ChapterChildNode> = None;

        for (let i=0; i < this.length; i++) {
            if (!node[i]) return Err(`!node[i]`);
            if (!node[i].uniqueId) return Err(`!node[i].uniqueId`);
            if (node[i].uniqueId === activePageId) {
                if (node[i+1]) {
                    childNode = Some(node[i + 1]);
                }
                break;
            }
            parentNode = Some(node[i]);
        }

        return Ok(Some({
            parentNode,
            childNode 
        }));
    }
}

export function Book(book: ApiData) {
    return new BookHandler(book);
}