import React, { useContext, useEffect, useReducer } from "react";
import { BOOK_SERVICE } from "../globals/types";

const bookState = {
    cache: {},
    dispatch: (data: any) => {},
}

export const FormContext = React.createContext({
    cache: {},
    dispatch: (data: any) => {},
});

export const useFormContext = () => useContext(FormContext);

const setter = (state: any, action: any) => {
    const { payload, _setter } = action;
    return { ...state, [_setter]: payload };
}

const setters = (state: any, action: any) => {
    const { _setters, _payloads } = action;
    let _state = state;
    _setters.forEach((s: string, index: number) => {
        _state[s] = _payloads[index];
    });
    return _state;
}

const reducer = (state: any, action: any) => {
    const { type, payload, viewType } = action;
    
    switch (type) { 
        case BOOK_SERVICE.SETTER:
            return setter(state, action);
        case BOOK_SERVICE.SETTERS:
            return setters(state, action);
        default:
            throw new Error(`Unknown type: ${action.type}`);
    }
}

export default function FormServiceProvider(props: { children: object }){
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
