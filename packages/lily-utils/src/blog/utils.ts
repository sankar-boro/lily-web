import { ApiData, RawData } from 'lily-types';

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

function groups(book_data: RawData) {
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

function groupBlogs(book_data: RawData) {
    let gs: any = {
        101: [],
        102: []
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
    while (orders.length !== chapters.length) {
        // eslint-disable-next-line no-loop-func
        for (let i=0; i < chapters.length; i++) {
            const thisChapter = chapters[i];
            if (currentParentId === thisChapter.parentId) {
                orders.push(thisChapter);
                currentParentId = thisChapter.uniqueId;
                times++;
                break;
            }
        }
        times++;
    }
    return orders;
};

export const sortAll = (_data: RawData, removeIds: any[] = []) => {
    let data: RawData = _data;
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
    let chapters: ApiData = [];
    Object.values(c).forEach((v) => {
        let a = buildSectionsReturnSections(v, ozf, ozs);
        chapters = [...chapters, ...a];
    });
    return chapters;
};

function groupBlog(p: any, b: any) {
    let pId = p.uniqueId;
    let blogs: any[] = [p];
    let c = 0;

    while (c !== b.length) {
        // eslint-disable-next-line no-loop-func
        b.forEach((ss: any) => {
            if (ss.parentId === pId) {
                blogs.push(ss);
                pId = ss.uniqueId;
            }
        });
        c++;
    }
    return blogs;

}

export const sortBlog = (_data: any, removeIds: any[] = []) => {
    let data: RawData = _data;
    const p = data[0];
    if (removeIds.length > 0) {
        data = _data.filter((d: any) => {
            if (removeIds.includes(d.uniqueId)) {
                return false;
            }
            return true;
        });
    }

    // let gs = groupBlogs(data);

    return groupBlog(p, data);
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