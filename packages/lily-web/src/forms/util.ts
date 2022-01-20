import { Some, Option, None } from "ts-results";
import { Node, FORM_TYPE } from "../../globals/types/index";

const sortAll = (data: Node[], parentId: string) => {
    let lastParentId = parentId;
    let newData: any = [];
    data.forEach((b) => {
        if (b.identity === 101) {
            newData.push({ ...b });
        }
    });
    data.forEach((d) => {
        if (d.identity === 104) {
            newData.push({ ...d, child: [] });
        }
    });
    data.forEach((d) => {
        if (d.identity === 105) {
            newData.forEach((n: any) => {
                if (n.uniqueId === d.parentId) {
                    n.child.push({ ...d, child: [] });
                }
            });
        }
    });
    newData.forEach((d: any) => {
        if (d.identity === 104) {
            const { child } = d;
            child.forEach((c: any) => {
                c["child"] = [];
                data.forEach((dd: any) => {
                    if (dd.parentId === c.uniqueId) {
                        c.child.push(dd);
                    }
                });
            });
        }
    });
    newData.forEach((d: any) => {
        if (d.identity === 104) {
            const { child } = d;
            child.forEach((c: any) => {
                if (c.child) {
                    data.forEach((dd: any) => {
                        if (dd.identity === 106) {
                            c.child.forEach((a: any) => {
                                if (dd.parentId === a.uniqueId) {
                                    c.child.push(dd);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
    return newData;
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
        formType: FORM_TYPE.NONE,
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
            formData.formType = FORM_TYPE.CHAPTER;
            // hideForm = true;
            return;
        }

        if (totalChapters > 1 && currentPageNo < totalChapters) {
            formData.formType = FORM_TYPE.CREATE_UPDATE;
            formData.updateIds.topUniqueId = chapter.uniqueId;
            formData.updateIds.botUniqueId = allPages[index + 1].uniqueId;
            return;
        }

        if (currentPageNo === totalChapters) {
            formData.formType = FORM_TYPE.CHAPTER;
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
};
