export type FormData = {
    topUniqueId: string;
    botUniqueId: string;
    identity: number;
};

export enum FORM_TYPE {
    FRONT_COVER = "FRONT_COVER",
    BACK_COVER = "BACK_COVER",
    PAGE = "PAGE",
    CHAPTER = "CHAPTER",
    SECTION = "SECTION",
    SUB_SECTION = "SUB_SECTION",
    CREATE_UPDATE = "CREATE_UPDATE",
    NONE = "NONE",
    UPDATE = "UPDATE",
}