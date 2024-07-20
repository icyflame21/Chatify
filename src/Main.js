import React, { useReducer, useState } from 'react';
import AppContext from 'context/Context';
import { getColor, getItemFromStore } from 'helpers/utils';
import { configReducer } from './reducers/configReducer';
import useToggleStyle from './hooks/useToggleStyle';
import { settings } from 'config';

const Main = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const configState = {
    isDark: getItemFromStore('isDark', settings.isDark),
  };

  const [config, configDispatch] = useReducer(configReducer, configState);

  const { isLoaded } = useToggleStyle(
    config.isDark,
    configDispatch
  );

  const setConfig = (key, value) => {
    configDispatch({
      type: 'SET_CONFIG',
      payload: {
        key,
        value,
      }
    });
  };

  if (!isLoaded) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: config.isDark ? getColor('dark') : getColor('light')
        }}
      />
    );
  }


  const handleLoading = (loading) => setLoading(loading);

  const handleUserInfo = (userInfo) => setUserInfo(userInfo);

  const contextValue = {
    config,
    setConfig,
    configDispatch,
    handleLoading,
    loading,
    handleUserInfo,
    userInfo,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};


export default Main;
