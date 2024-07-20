import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './MainLayout';
import ErrorLayout from './ErrorLayout';
import Error404 from 'components/errors/Error404';
import is from 'is_js';
import Landing from 'components/dashboard/Landing';
import Profile from 'components/app/profile/Profile';
import Chat from 'components/app/chat/Chat';

const DashboardLayout = () => {

  useEffect(() => {
    const HTMLClassList = document.getElementsByTagName('html')[0].classList;

    if (is.windows()) {
      HTMLClassList.add('windows');
    }
    if (is.chrome()) {
      HTMLClassList.add('chrome');
    }
    if (is.firefox()) {
      HTMLClassList.add('firefox');
    }

    // Cleanup function to remove classes on unmount
    return () => {
      HTMLClassList.remove('windows', 'chrome', 'firefox');
    };
  }, []);


  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/social" element={<Chat />} />
        <Route path="/" element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route element={<ErrorLayout />}>
        <Route path="/404" element={<Error404 />} />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default DashboardLayout;
