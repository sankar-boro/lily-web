import { RawData, DefaultActionType } from './index';

export enum HOME_SERVICE {
    SETTERS = 'SETTERS',
}
export type HomeContextType = {
    books: any[],
    book?: null | RawData,
    vue: {
        isRead: boolean,
    },
    dispatch: (data: any) => void,
}
export type HomeActionType = DefaultActionType;