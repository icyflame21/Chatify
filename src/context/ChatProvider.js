import React, { createContext, useState } from "react";
import DefaultProfile from 'assets/img/avatar.png'

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chatHistory, setChatHistory] = useState({
        loading: true,
        data: []
    });

    const [chatMessages, setChatmessages] = useState({
        loading: true,
        data: []
    });

    const [isOpenThreadInfo, setIsOpenThreadInfo] = useState(false)
    const [hideSidebar, setHideSidebar] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const [scrollToBottom, setScrollToBottom] = useState(true);

    const handleHideSideBar = (value) => setHideSidebar(value)
    const handleIsSending = (value) => setIsSending(value)


    const handleScrollToBottom = (value) => setScrollToBottom(value)

    const handleOpenThreadInfo = (value) => setIsOpenThreadInfo(value)

    const handleChatHistory = (value) => {
        setChatHistory(prevState => ({
            ...prevState,
            ...value
        }));
    };

    const handleChatMessages = (value) => {
        setChatmessages(prevState => ({
            ...prevState,
            ...value
        }));
    };

    const getUser = thread => {
        let user = {};
        user = {
            avatarSrc: thread?.members_history?.map(
                member => member.image ?? DefaultProfile ?? thread?.chat_group_options?.group_image
            )
        };
        return user;
    };

    const contextValue = {
        chatHistory,
        handleChatHistory,
        isOpenThreadInfo,
        handleOpenThreadInfo,
        getUser,
        hideSidebar,
        handleHideSideBar,
        scrollToBottom,
        handleScrollToBottom,
        handleChatMessages,
        chatMessages,
        handleIsSending,
        isSending
    };

    return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};
