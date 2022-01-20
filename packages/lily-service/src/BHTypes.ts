import { Option } from "ts-results";

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

export enum ID_TYPES {
    BOOK = "BOOK",
    ACTIVE = "ACTIVE",
    SECTION = "SECTION",
    EDIT_SUB_SECTION = "EDIT_SUB_SECTION",
    PARENT = "PARENT",
    FORM = "FORM"
}

export type Form = {
    formType: FORM_TYPE;
    formData: Option<FormData>;
};

export enum BOOK_SERVICE {
    API_STATE = 'API_STATE',
    API_DATA = 'API_DATA',
    SETTER = 'SETTER',
    SETTERS = 'SETTERS',
    FORM_PAGE_SETTER = 'FORM_PAGE_SETTER',
    ACTIVE_PAGE = 'ACTIVE_PAGE'
}