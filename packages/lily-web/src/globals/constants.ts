const constants = {
    IDLE: 100,
    RESULT: 200,
    WAITING: 300,
    LOCKED: 409,
    heights: {
        fromTopNav: {
            leftBar: 35,
            rightBar: 35,
            topBar: 45,

        }
    }
}

const URLS = {
    UPDATE_OR_DELETE: "http://localhost:8000/book/update_or_delete",
}

const ENV = {
    LOG: true,
}

export {constants, URLS, ENV};