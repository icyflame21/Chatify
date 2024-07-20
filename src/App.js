import React, { useEffect, useContext } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import './App.css';
import { onAuthStateChanged } from "firebase/auth";
import AppContext from 'context/Context';
import { LoginProvider } from 'context/LoginProvider';
import { auth, firestore } from 'config';
import DashboardLayout from 'layouts/DashboardLayout';
import AuthenticatedLayout from 'layouts/AuthenticatedLayout';
import { doc, getDoc } from 'firebase/firestore';
import { Col, Row, Spinner } from 'react-bootstrap';

const App = () => {
  const { handleUserInfo, userInfo, loading, handleLoading } = useContext(AppContext);
  const authChannel = new BroadcastChannel('auth');

  useEffect(() => {
    const handleAuthStateChange = async (user) => {
      handleLoading(true);
      try {
        if (user) {
          await user.reload();
          if (user.emailVerified) {
            const documentRef = doc(firestore, "User-Data", user.uid);
            const docSnap = await getDoc(documentRef);
            if (docSnap.exists()) {
              authChannel.postMessage({ status: 'loggedIn', userData: docSnap.data() });
              handleUserInfo(docSnap.data());
            } else {
              handleUserInfo({});
            }
          } else {
            handleUserInfo({});
          }
        } else {
          authChannel.postMessage({ status: 'loggedOut' });
          handleUserInfo({});
        }
      } catch (error) {
        console.error("Error during auth state change: ", error);
        handleUserInfo({});
      } finally {
        handleLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    authChannel.onmessage = (event) => {
      try {
        if (event.data.status === 'loggedOut') {
          handleUserInfo({});
        } else if (event.data.status === 'loggedIn') {
          handleUserInfo(event.data.userData);
        }
      } catch (error) {
        console.error("Error processing authChannel message: ", error);
      }
    };

    return () => {
      authChannel.close();
    };
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
