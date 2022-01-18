import { getChapterData } from "./util";
import { Form, FORM_TYPE } from "../../globals/types";
import { None, Some } from "ts-results";
import { Dispatch, SetStateAction } from "react";

type BookNavigationProps = {
    title: string;
    setActiveId: Dispatch<SetStateAction<string | null>>;
    allPages: any;
    setSectionId: Dispatch<SetStateAction<string | null>>;
    setParentId: Dispatch<SetStateAction<string | null>>;
    setCurrentFormType: Dispatch<SetStateAction<Form>>;
    activeId: string | null;
    sectionId: string | null;
};

type ChapterFormData = {
    formType: FORM_TYPE;
    chapter: any;
    updateIds: {
        topUniqueId: string;
        botUniqueId: string;
    };
    identity: number;
    parentId: string;
    setCurrentFormType: Dispatch<SetStateAction<Form>>;
    setParentId: Dispatch<SetStateAction<string | null>>;
};
const BookNavigation = (props: BookNavigationProps) => {
    const {
        setActiveId,
        allPages,
        setSectionId,
        setParentId,
        setCurrentFormType,
        sectionId,
    } = props;

    let totalChapters = allPages.length;
    if (allPages.length === 0) return null;

    return (
        <div>
            {allPages.map((value: any, index: number) => {
                const { chapterData, formData, key } = getChapterData(
                    value,
                    index,
                    totalChapters,
                    allPages,
                    props
                );
                const { sections, chapter } = chapterData;
                return (
                    <div key={key}>
                        <div
                            style={{
                                borderLeft: "1px solid #ccc",
                                marginLeft: 4,
                                paddingLeft: 8,
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveId(chapter.uniqueId);
                                setCurrentFormType({
                                    formType: FORM_TYPE.NONE,
                                    formData: None,
                                });
                                setSectionId(null);
                            }}
                        >
                            {chapter.title}
                        </div>
                        {/* section */}
                        {/* <div
                            style={{
                                borderLeft: "1px solid #ccc",
                                marginLeft: 4,
                                paddingLeft: 16,
                            }}
                            onClick={(e: any) =>
                                addNewSection(e, props, sections, chapter, 0)
                            }
                        >
                            <span
                                style={{
                                    borderLeft: "1px solid #ccc",
                                    marginRight: 8,
                                }}
                            />
                            +
                        </div> */}
                        <div
                            style={{
                                borderLeft: "1px solid #ccc",
                                marginLeft: 4,
                                paddingLeft: 16,
                            }}
                        >
                            {sections.map((c: any, _index: number) => {
                                return (
                                    <div key={`${_index}`}>
                                        <div
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (_index === 0) return;
                                                setSectionId(c.uniqueId);
                                                setActiveId(chapter.uniqueId);
                                                setParentId(c.uniqueId);
                                                setCurrentFormType({
                                                    formType: FORM_TYPE.NONE,
                                                    formData: None,
                                                });
                                            }}
                                        >
                                            {c.title}
                                        </div>
                                        <div
                                            onClick={(e: any) =>
                                                addNewSection(
                                                    e,
                                                    props,
                                                    sections,
                                                    c,
                                                    _index,
                                                    chapter.uniqueId
                                                )
                                            }
                                        >
                                            <span
                                                style={{
                                                    borderLeft:
                                                        "1px solid #ccc",
                                                    marginRight: 8,
                                                }}
                                            />
                                            +
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* chapter */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-start",
                            }}
                            className="hover"
                            // onClick={(e) => addNewChapter(e, formData)}
                        >
                            +
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const addNewChapter = (e: any, formData: ChapterFormData) => {
    e.preventDefault();
    const { updateIds, chapter, setCurrentFormType, setParentId } = formData;
    if (formData.formType === FORM_TYPE.CREATE_UPDATE) {
        setCurrentFormType({
            formType: FORM_TYPE.CREATE_UPDATE,
            formData: Some({
                topUniqueId: updateIds.topUniqueId,
                botUniqueId: updateIds.botUniqueId,
                identity: formData.identity,
            }),
        });
        setParentId(chapter.uniqueId);
    } else {
        setCurrentFormType({
            formType: FORM_TYPE.CHAPTER,
            formData: None,
        });
        setParentId(chapter.uniqueId);
    }
};

const addNewSection = (
    e: any,
    props: BookNavigationProps,
    sections: any,
    c: any,
    _index: number,
    chapterId: string
) => {
    const { setCurrentFormType, setParentId } = props;
    e.preventDefault();

    if (_index === 0 && sections.length === 1) {
        setParentId(chapterId);
        setCurrentFormType({
            formType: FORM_TYPE.SECTION,
            formData: None,
        });
        return;
    }

    if (_index === 0 && sections.length > 1) {
        const topUniqueId = chapterId;
        const nextSection = sections[_index + 1];
        const botUniqueId = nextSection.uniqueId;
        setParentId(chapterId);
        setCurrentFormType({
            formType: FORM_TYPE.CREATE_UPDATE,
            formData: Some({
                topUniqueId,
                botUniqueId,
                identity: 105,
            }),
        });
        return;
    }

    const lengthMatchIndex = sections.length - 1;

    if (sections.length > 1 && _index !== 0 && _index < lengthMatchIndex) {
        const currentSection = sections[_index];
        const nextSection = sections[_index + 1];
        const topUniqueId = currentSection.uniqueId;
        const botUniqueId = nextSection.uniqueId;
        setParentId(currentSection.uniqueId);
        setCurrentFormType({
            formType: FORM_TYPE.CREATE_UPDATE,
            formData: Some({
                topUniqueId,
                botUniqueId,
                identity: 105,
            }),
        });
        return;
    }

    if (sections.length > 1 && _index === lengthMatchIndex) {
        const currentSection = sections[_index];
        setParentId(currentSection.uniqueId);
        setCurrentFormType({
            formType: FORM_TYPE.SECTION,
            formData: None,
        });
        return;
    }
};
export { BookNavigation };
