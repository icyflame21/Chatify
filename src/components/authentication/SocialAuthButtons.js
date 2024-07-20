import React, { useContext, } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, firestore } from 'config';
import AppContext from 'context/Context';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { showToast } from 'helpers/toast';

const SocialAuthButtons = ({ loginLoading, setLoginLoading, heading, handleFirebaseError }) => {
  const { handleUserInfo } = useContext(AppContext);
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.emailVerified) {
        const documentRef = doc(firestore, "User-Data", result.user.uid);
        const docSnap = await getDoc(documentRef);

        const userInfo = {
          userName: result.user.displayName,
          firstName: result._tokenResponse.firstName,
          lastName: result._tokenResponse.lastName,
          profileHeading: heading,
          userEmail: result.user.email,
          userProfilePhoto: result.user.photoURL,
          accessToken: result.user.accessToken,
          providerData: result.user.providerData,
          emailVerified: result.user.emailVerified,
          uid: result.user.uid,
        };

        if (docSnap.exists()) {
          handleUserInfo(docSnap.data());
          await updateDoc(documentRef, { accessToken: result.user.accessToken });
        } else {
          await setDoc(documentRef, userInfo);
          handleUserInfo(userInfo);
        }

        showToast(`Logged in as ${result.user.email}`, 'success');
      } else {
        showToast('Email not verified', 'warning');
      }
      setLoginLoading(false);
    } catch (error) {
      handleFirebaseError(error)
      setLoginLoading(false);
    }
  };

  return (
    <Form.Group className="mb-0">
      <Row>
        <Col sm={12}>
          <Button
            variant=""
            size="sm"
            disabled={loginLoading}
            className="btn-outline-google-plus mt-2 w-100"
            onClick={handleGoogleLogin}
          >
            <FontAwesomeIcon
              icon={['fab', 'google-plus-g']}
              transform="grow-8"
              className="me-2"
            />{' '}
            Google
          </Button>
        </Col>
      </Row>
    </Form.Group>
  );
};

export default SocialAuthButtons;
