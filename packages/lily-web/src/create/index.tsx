import BodyRenderer from "./BodyRenderer";
import NavigationRenderer from "./NavigationRenderer";
import { BookServiceProvider, setActivePageFn, sortAll, useBookContext } from 'lily-service';
import { useEffect } from "react";
import { BOOK_SERVICE } from "lily-types";

const Body = () => {
    const context = useBookContext();
    const { dispatch, notifications, rawData, bookId, activePage, formData }: any = useBookContext();
    useEffect(() => {
        dispatch({
            type: BOOK_SERVICE.SETTERS,
            setters: [
                {
                    key: 'formData',
                    value: {
                        url: "http://localhost:8000/book/create/new/book",
                        identity: 101,
                        type: 'NEW_BOOK'
                    }
                }
            ]
        })
    }, []);

    useEffect(() => {
        if (notifications && notifications.type === 'NEW_BOOK') {
            const res = notifications.data;
            if (res.err) {
                console.log(res.val);
                return;
            }
            if (!res.val) {
                console.log("App in debug mode.");
                return;
            }
            if (res.val) {
                if (!rawData) {
                    let resData: any = res.val;
                    let bookId = resData.uniqueId;
                    let newRawData = [resData];
                    let newApiData = sortAll(newRawData, []);
                    let newActivePage = setActivePageFn({
                        apiData: newApiData,
                        compareId: bookId
                    });
                    dispatch({
                        type: BOOK_SERVICE.SETTERS,
                        setters: [
                            {
                                key: 'rawData',
                                value: newRawData
                            },
                            {
                                key: 'apiData',
                                value: newApiData
                            },
                            {
                                key: 'activePage',
                                value: newActivePage,
                            },
                            {
                                key: 'bookId',
                                value: bookId,
                            },
                            {
                                key: 'notifications',
                                value: null,
                            }
                        ]
                    })
                }
            }
        }

        if (notifications && notifications.type === 'NEW_NODE') {
            const res = notifications.data;
            if (res.err) {
                console.log(res.val);
                return;
            }
            if (!res.val) {
                console.log("App in debug mode.");
                return;
            }
            if (res.val) {
                if (rawData && bookId && activePage) {
                    const { __formData } = notifications;
                    let resData: any = res.val;
                    let newResData = {
                        parentId: formData.topUniqueId,
                        uniqueId: resData.uniqueId,
                        title: __formData.title,
                        body: __formData.body,
                        createdAt: resData.uniqueId,
                        updatedAt: resData.uniqueId,
                        bookId,
                        identity: formData.identity
                    };
                    let newRawData = rawData;
                    newRawData.push(newResData);
                    let newApiData = sortAll(newRawData, []);
                    let newActivePage = setActivePageFn({
                        apiData: newApiData,
                        compareId: activePage.uniqueId
                    });
                    dispatch({
                        type: BOOK_SERVICE.SETTERS,
                        setters: [
                            {
                                key: 'rawData',
                                value: rawData
                            },
                            {
                                key: 'apiData',
                                value: newApiData
                            },
                            {
                                key: 'activePage',
                                value: newActivePage,
                            },
                            {
                                key: 'notifications',
                                value: null,
                            }
                        ]
                    })
                }
            }
        }
    }, [notifications]);

    return <>    
        <NavigationRenderer />
        <BodyRenderer />
    </>
}
export default function Main(){
    return <BookServiceProvider>
        <Body />
    </BookServiceProvider>
}
