export const formView = () => {
    return {
        isForm: true,
        isDoc: false,
        isNull: false,
    }
}

export const docView = () => {
    return {
        isForm: false,
        isDoc: true,
        isNull: false,
    }
}