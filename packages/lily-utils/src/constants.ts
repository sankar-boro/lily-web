export const formView = {
    isForm: true,
    isDoc: false,
    isNull: false,
}

export const docView = {
    isForm: false,
    isDoc: true,
    isNull: false,
}

export const defaultDocView = {
    document: {},
    form: {},
    ...docView
}

export const defaultFormView = {
    document: {},
    form: {},
    ...formView
}