import { Some, Option, None } from "ts-results";
import { Node } from "../../globals/types"

type FormData = {
    topUniqueId: string;
    botUniqueId: string;
    identity: number;
};

enum FormType {
    FRONT_COVER = "FRONT_COVER",
    BACK_COVER = "BACK_COVER",
    PAGE = "PAGE",
    CHAPTER = "CHAPTER",
    SECTION = "SECTION",
    SUB_SECTION = "SUB_SECTION",
    CREATE_UPDATE = "CREATE_UPDATE",
    NONE = "NONE",
}

type Form = {
    formType: FormType;
    formData: Option<FormData>;
};

function groupSections(dd: any, s: any) {
    let pId = dd.uniqueId;
    let sections: any[] = [];
    let c = 0;

    let removeIds: any[] = [];
    let newIds: any[] = [];

    while (c !== s.length) {
        // eslint-disable-next-line no-loop-func
        s.forEach((ss: any) => {
            if (ss.parentId === pId) {
                sections.push(ss);
                pId = ss.uniqueId;
                removeIds.push(ss.uniqueId);
            }
        });
        c++;
    }

    s.forEach((ss: any) => {
        if (!removeIds.includes(ss.uniqueId)) {
            newIds.push(ss);
        }
    });

    return { data: { ...dd, child: sections }, newSections: newIds };
}

function buildSectionsReturnSections(
    chapters: any,
    sections: any,
    sub_sections: any
) {
    let dynaSections = sections;
    return chapters.map((chapter: any) => {
        let buildSections = groupSections(chapter, dynaSections);
        dynaSections = buildSections.newSections;

        if (
            buildSections.data.child &&
            Array.isArray(buildSections.data.child) &&
            buildSections.data.child.length === 0
        ) {
            return buildSections.data;
        }

        if (
            buildSections.data.child &&
            Array.isArray(buildSections.data.child) &&
            buildSections.data.child.length > 0
        ) {
            let dynaSubSections = sub_sections;
            let buildSubSections = buildSections.data.child.map(
                (sections_: any) => {
                    let tempBuildSubSections = groupSections(
                        sections_,
                        dynaSubSections
                    );
                    dynaSubSections = tempBuildSubSections.newSections;
                    return tempBuildSubSections.data;
                }
            );

            buildSections.data.child = buildSubSections;
            return buildSections.data;
        }
        return buildSections.data;
    });
}

function groups(book_data: Node[]) {
    let gs: any = {
        101: [],
        102: [],
        103: [],
        104: [],
        105: [],
        106: [],
    };

    book_data.forEach((d: Node) => {
        if (gs[d.identity]) {
            gs[d.identity].push(d);
        }
    });
    return gs;
}

const sortAll = (data: Node[]) => {
    let gs = groups(data);
    let ozf = gs[105];
    let ozs = gs[106];

    let c = { 101: gs[101], 102: gs[102], 103: gs[103], 104: gs[104] };
    let chapters: Node[] = [];
    Object.values(c).forEach((v) => {
        let a = buildSectionsReturnSections(v, ozf, ozs);
        chapters = [...chapters, ...a];
    });
    return chapters;
};

const activeChBg = (c: any, a: string | null) => {
    let color = "white";
    if (a && c.uniqueId === a) {
        color = "#eff0f1";
    }
    return {
        backgroundColor: color,
    };
};
const activeScBg = (c: any, a: string | null) => {
    if (a && c.uniqueId === a) {
        return {
            backgroundColor: "#f1f1f1",
        };
    }
    return {};
};
const displayNone = (c: any, a: string) => {
    let display = "none";
    if (c.uniqueId === a) {
        display = "block";
    }
    return {
        display,
    };
};

const doSome = (data: any) => {
    let child = [{ title: "" }];
    if (data && data.child && Array.isArray(data.child)) {
        child = [...child, ...data.child];
    }

    return {
        chapter: data,
        sections: child,
    };
};

const getChapterData = (
    value: any,
    index: number,
    totalChapters: number,
    allPages: any,
    props: any
) => {
    const { chapter, sections } = doSome(value);
    const { setCurrentFormType, setParentId } = props;
    let formData = {
        formType: FormType.NONE,
        chapter,
        updateIds: {
            topUniqueId: "",
            botUniqueId: "",
        },
        identity: 104,
        parentId: chapter.uniqueId,
        setCurrentFormType,
        setParentId,
    };
    const currentPageNo = index + 1;
    // let hideForm = false;
    const formHelp = () => {
        if (totalChapters === 1) {
            formData.formType = FormType.CHAPTER;
            // hideForm = true;
            return;
        }

        if (totalChapters > 1 && currentPageNo < totalChapters) {
            formData.formType = FormType.CREATE_UPDATE;
            formData.updateIds.topUniqueId = chapter.uniqueId;
            formData.updateIds.botUniqueId = allPages[index + 1].uniqueId;
            return;
        }

        if (currentPageNo === totalChapters) {
            formData.formType = FormType.CHAPTER;
        }
    };

    formHelp();

    return {
        chapterData: doSome(value),
        formData,
        key: index,
    };
};

// const getSectionData = (
//     e: any,
//     props: any,
//     sections: any,
//     data: any,
//     index: number
// ) => {
//     e.preventDefault();
//     let formData = {
//         formType: 105,
//         chapter,
//         updateIds: {
//             topUniqueId: "",
//             botUniqueId: "",
//         },
//         identity: 105,
//         parentId: chapter.uniqueId,
//         setCurrentFormType,
//         setParentId,
//     };
// };

export {
    sortAll,
    activeChBg,
    activeScBg,
    displayNone,
    getChapterData,
    FormType,
    // getSectionData,
};
export type { Node, Form, FormData, FormType as FormTypes };
