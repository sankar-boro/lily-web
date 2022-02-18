import { RawData, DefaultActionType } from './index';

export enum HOME_SERVICE {
    SETTERS = 'SETTERS',
}
export type HomeContextType = {
    books: any[],
    book?: null | RawData,
    dispatch: (data: any) => void,
}
export type HomeActionType = DefaultActionType;