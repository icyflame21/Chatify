import React, { useEffect, useContext } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import './App.css';
import { onAuthStateChanged } from "firebase/auth";
import AppContext from 'context/Context';
import { LoginProvider } from 'context/LoginProvider';
import { auth, firestore } from 'config';
import DashboardLayout from 'layouts/DashboardLayout';
import AuthenticatedLayout from 'layouts/AuthenticatedLayout';
import { doc, onSnapshot } from 'firebase/firestore';
import { Col, Row, Spinner } from 'react-bootstrap';

const App = () => {
  const { handleUserInfo, userInfo, loading, handleLoading } = useContext(AppContext);
  useEffect(() => {
    const handleAuthStateChange = (user) => {
      handleLoading(true);
      if (user && user.emailVerified) {
        const documentRef = doc(firestore, "User-Data", user.uid);
        const unsubscribe = onSnapshot(documentRef, (snapshot) => {
          if (snapshot.exists()) {
            handleUserInfo(snapshot.data());
          } else {
            handleUserInfo({});
          }
          handleLoading(false);
        }, (error) => {
          console.error("Error listening to Firestore changes: ", error);
          handleUserInfo({});
          handleLoading(false);
        });

        return unsubscribe;
      } else {
        handleUserInfo({});
        handleLoading(false);
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, handleAuthStateChange);

    return () => unsubscribeAuth();
  }, []);

  return (
    loading ? (
      <Row className="g-0 w-100 h-100">
        <Col xs={12} className='d-flex align-items-center justify-content-center' style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
          <Spinner animation="border" variant="success" />
        </Col>
      </Row>
    ) : Object.keys(userInfo).length > 0 ? (
      <DashboardLayout />
    ) : (
      <LoginProvider>
        <AuthenticatedLayout />
      </LoginProvider>
    )
  );
};

export default App;
