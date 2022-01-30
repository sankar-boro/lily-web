import BodyRenderer from "./BodyRenderer";
import NavigationRenderer from "./NavigationRenderer";
import { BookServiceProvider, setActivePageFn, sortAll, useBookContext } from 'lily-service';
import { useEffect } from "react";
import { BOOK_SERVICE } from "lily-types";

const Body = () => {
    const { dispatch, notifications, rawData, bookId, activePage }: any = useBookContext();
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

        if (notifications && notifications.type === 'NEW_NOE') {
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
                    let resData: any = res.val;
                    let newRawData = [...rawData, resData];
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
