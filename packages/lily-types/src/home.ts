import { RawData, DefaultActionType } from './index';

export type HomeContextType = {
    books: any[],
    book?: null | RawData,
    dispatch: (data: any) => void,
}
export type HomeActionType = DefaultActionType;
export enum DefaultSetter {
    SETTERS = 'SETTERS',
}
export enum HOME_SERVICE {
    SETTERS = 'SETTERS',
}