import { AuthActionType } from "lily-types";

const updateState = ({
    state,
    setters
}: 
{ 
    state: any, 
    setters: { keys: any[], values: any[] } 
}) => {
    const { keys, values } = setters;
    const updateData: any = {};
    keys.forEach((keyName: string, keyIndex: any) => {
        if (state.hasOwnProperty(keyName)) {
            updateData[keyName] = values[keyIndex];
        }
    })
    return updateData;
}

export const setters = (state: any, action: AuthActionType) => {
    const { setters } = action;
    if (setters) {
        const { keys, values } = setters;
        if (keys.length === values.length) {
            return { 
                ...state, 
                ...updateState({
                    state,
                    setters
                }) 
            };
        }
    }
    return state;
}