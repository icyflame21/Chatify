import React, { createContext, useState } from "react";

export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
    const [group_loading, setgroupLoading] = useState(false)

    const handleGroupLoading = (value) => setgroupLoading(value);

    const contextValue = {
        group_loading,
        handleGroupLoading,
    };

    return <GroupContext.Provider value={contextValue}>{children}</GroupContext.Provider>;
};