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

    book_data.forEach((d: any) => {
        if (gs[d.identity]) {
            gs[d.identity].push(d);
        }
    });
    return gs;
}

const groupChapters = (parentId: string, chapters: any) => {
    let currentParentId = parentId;
    let orders: any = [];
    let times = 0;
    while (times !== 3) {
        // eslint-disable-next-line no-loop-func
        chapters.forEach((chapter: any) => {
            if (chapter.parentId === currentParentId) {
                orders.push(chapter);
                currentParentId = chapter.uniqueId;
            }
        });
        times++;
    }
    return orders;
};

export const sortAll = (_data: Node[], removeIds: any[] = []) => {
    let data = _data;
    if (removeIds.length > 0) {
        data = _data.filter((d: any) => {
            if (removeIds.includes(d.uniqueId)) {
                return false;
            }
            return true;
        });
    }

    let gs = groups(data);
    let ozf = gs[105];
    let ozs = gs[106];

    let c = { 101: gs[101], 102: gs[102], 103: gs[103], 104: gs[104] };
    c[104] = groupChapters(c[101][0].uniqueId, c[104]);
    let chapters: Node[] = [];
    Object.values(c).forEach((v) => {
        let a = buildSectionsReturnSections(v, ozf, ozs);
        chapters = [...chapters, ...a];
    });
    return chapters;
};

export const setActivePageFn = (props: {
    apiData: any,
    compareId: any,
}) => {
    const { apiData, compareId } = props;
    let activePage = null;
    let found = false;
    apiData.forEach((page: any) => {
        if (!found && page.uniqueId === compareId) {
            activePage = page;
        }
        page.child.forEach((section: any) => {
            if (!found && section.uniqueId === compareId) {
                activePage = section;
            }
        })
    });
    
    return activePage;
}

export const deleteSubSection = (props: any, state: any) => {
    const { subSectionId, setActivePage } = props;
    const { activePage, rawData } = state;
    const newRawData = rawData.filter((data: any) => {
        if (subSectionId === data.uniqueId) return false;
        return true;
    })
    const newApiData = sortAll(rawData, [subSectionId]);
    let newActivePage = null;
    newApiData.forEach((page: any) => {
        page.child.forEach((section: any) => {
            if (section.uniqueId === activePage.uniqueId) {
                newActivePage = section;
            }
        })
    });
    return { ...state, activePage: newActivePage, rawData: newRawData, apiData: newApiData };
}