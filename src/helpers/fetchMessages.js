import { useContext, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { convertTimestampToDate, formatDate, formatTimestamp } from './formatTimeStamp';
import { ChatContext } from 'context/ChatProvider';
import { firestore } from 'config';
import AppContext from 'context/Context';
import 'moment-timezone';

const useFetchMessages = () => {
    const { handleChatMessages } = useContext(ChatContext);
    const { userInfo } = useContext(AppContext);
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const fetchMessagesFromFirestore = useCallback((token_id) => {
        const q = query(
            collection(firestore, token_id),
            orderBy("createdAt", "asc"),
        );
        return onSnapshot(q, (querySnapshot) => {
            const messagesByDate = formatMessages(querySnapshot);
            handleChatMessages({
                loading: false,
                data: messagesByDate
            });
        }, (error) => {
            handleChatMessages({
                loading: false,
                data: {}
            });
            console.error('Error fetching documents: ', error);
        });
    }, [handleChatMessages]);

    const formatMessages = (querySnapshot) => {
        const messagesByDate = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const createdAtDate = convertTimestampToDate(data.createdAt);
            const dateKey = formatDate(createdAtDate, userTimezone);
            if (!messagesByDate[dateKey]) {
                messagesByDate[dateKey] = [];
            }

            const formattedMessage = {
                ...data,
                id: doc.id,
                createdAt: formatTimestamp(data.createdAt),
                createdBy: data.sender_uid === userInfo.uid ? 'You' : data.createdBy,
            };

            messagesByDate[dateKey].push(formattedMessage);
        });

        return messagesByDate;
    };

    useEffect(() => {
        const token_id = userInfo?.chat_group_options?.token_id;
        if (!token_id) {
            console.error('Token ID is not available');
            return;
        }
        const unsubscribe = fetchMessagesFromFirestore(token_id);
        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    return;
};

export default useFetchMessages;
