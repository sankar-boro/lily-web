import React, { useContext, useReducer } from "react";
import { BOOK_SERVICE } from "lily-types";

const bookState = {
    cache: {},
    dispatch: (data: any) => {},
}

export const FormContext = React.createContext({
    cache: {},
    dispatch: (data: any) => {},
});

export const useFormContext = () => useContext(FormContext);

const setters = (state: any, action: any) => {
    const { setters } = action;
    if (setters) {
        const { keys, values } = setters;
        const updateData: any = {};
        if (keys.length === values.length) {
            keys.forEach((keyName: any, keyIndex: any) => {
                updateData[keyName] = values[keyIndex];
            })
        }
        return { ...state, ...updateData };
    }
    return state;
}

const reducer = (state: any, action: any) => {
    return setters(state, action);
}

export const FormServiceProvider = (props: { children: object }) => {
    const [state, dispatch] = useReducer(reducer, bookState);

    return (
        <FormContext.Provider
            value={{
                ...state,
                dispatch: dispatch,
            }}
        >
            {props.children}
        </FormContext.Provider>
    );
};
