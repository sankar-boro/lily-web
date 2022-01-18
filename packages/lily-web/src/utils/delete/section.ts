import { Chapter as ChapterData, Section as SectionData, ApiData } from "../../globals/types";
import { Ok, Err, Option, Some, None, Result } from "ts-results";

type UniqueId = string;

class SectionImpl {
    node: SectionData;

    constructor(section: SectionData) {
        this.node = section;
    }

    getChildIds(): UniqueId[] {
        let ids: UniqueId[] = [];
        this.node.child.forEach((subSection) => {
            ids.push(subSection.uniqueId);
        });
        return ids;
    }

    allIdsFromSection(ids: UniqueId[]) {
        ids.push(this.node.uniqueId); // section id
        this.node.child.forEach((subSection) => {
            ids.push(subSection.uniqueId); // sub section id
        });
    }
}

export const Section = (section: SectionData) => {
    return new SectionImpl(section);
}