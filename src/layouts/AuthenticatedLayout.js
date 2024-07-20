import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthSimpleLayout from './AuthSimpleLayout';
import ErrorLayout from './ErrorLayout';
import Error404 from 'components/errors/Error404';
import SimpleLogin from 'components/authentication/simple/Login';
import SimpleRegistration from 'components/authentication/simple/Registration';
import SimpleForgetPassword from 'components/authentication/simple/ForgetPassword';
import is from 'is_js';


const AuthenticatedLayout = () => {
  const HTMLClassList = document.getElementsByTagName('html')[0].classList;
  useEffect(() => {
    if (is.windows()) {
      HTMLClassList.add('windows');
    }
    if (is.chrome()) {
      HTMLClassList.add('chrome');
    }
    if (is.firefox()) {
      HTMLClassList.add('firefox');
    }
  }, [HTMLClassList]);

  return (
    <Routes>
      <Route element={<ErrorLayout />}>
        <Route path="/404" element={<Error404 />} />
      </Route>

      <Route element={<AuthSimpleLayout />}>
        <Route path="/" element={<SimpleLogin />} />
        <Route
          path="/register"
          element={<SimpleRegistration />}
        />
        <Route
          path="/forgot-password"
          element={<SimpleForgetPassword />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AuthenticatedLayout;
