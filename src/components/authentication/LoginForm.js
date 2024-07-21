import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import axios from 'axios';
import { auth, firestore } from 'config';
import AppContext from 'context/Context';
import { LoginContext } from 'context/LoginProvider';
import Divider from 'components/common/Divider';
import SocialAuthButtons from './SocialAuthButtons';
import Flex from 'components/common/Flex';
import { showToast } from 'helpers/toast';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { handleUserInfo } = useContext(AppContext);
  const { loginLoading, handleLoginLoading } = useContext(LoginContext);
  const [heading, setHeading] = useState('');

  const fetchHeading = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_RANDOM_PROFILE_HEADING_URL);
      setHeading(response.data.content);
    } catch (error) {
      console.log('Failed to fetch heading', error);
    }
  };

  const handleFirebaseError = (error) => {
    const errorMessage = error.message.replace('Firebase: ', '');
    showToast(errorMessage, 'danger');
  };

  const onSubmit = async (data) => {
    handleLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          if (user.emailVerified) {
            const documentRef = doc(firestore, "User-Data", user.uid);
            const docSnap = await getDoc(documentRef);
            const parts = user.email.split('@')[0].split('.');
            const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
            const lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);

            const userInfo = {
              userName: user.displayName || `${firstName} ${lastName}`,
              firstName,
              lastName,
              userEmail: user.email,
              userProfilePhoto: user.photoURL,
              accessToken: user.accessToken,
              providerData: user.providerData,
              emailVerified: user.emailVerified,
              uid: user.uid,
              profileHeading: heading,
            };

            if (docSnap.exists()) {
              handleUserInfo(docSnap.data());
              await updateDoc(documentRef, { accessToken: user.accessToken });
            } else {
              await setDoc(documentRef, userInfo);
              handleUserInfo(userInfo);
            }

            showToast(`Logged in as ${data.email}`, 'success');
            reset()
          } else {
            showToast('Email not verified', 'warning');
          }
        }
        handleLoginLoading(false);
      });
    } catch (error) {
      handleFirebaseError(error);
      handleLoginLoading(false);
    }
  };

  useEffect(() => {
    fetchHeading();
    document.title = 'Chatify | Login';
  }, []);

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)} role="form">
      <Form.Group className="mb-3">
        <Form.Control
          placeholder="email@domain.com"
          name="email"
          type="email"
          disabled={loginLoading}
          isInvalid={!!errors.email}
          {...register('email', {
            required: 'Email Id is required',
            pattern: {
              value: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/i,
              message: 'Email must be valid',
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email && errors.email.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Control
          placeholder="Password"
          name="password"
          type="password"
          disabled={loginLoading}
          isInvalid={!!errors.password}
          {...register('password', {
            required: 'You must specify a password',
            minLength: {
              value: 6,
              message: 'Password must have at least 6 characters',
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password && errors.password.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Row className="justify-content-between align-items-center">
        <Col xs="auto">
        </Col>
        {!loginLoading && (
          <Col xs="auto">
            <Link className="fs--1 mb-0" to="/forgot-password">
              Forget Password?
            </Link>
          </Col>
        )}
      </Row>

      <Form.Group>
        {loginLoading ? (
          <Row className="g-0">
            <Col xs={12} className="w-100 h-100 my-3">
              <Flex className="align-items-center justify-content-center">
                <Spinner animation="border" variant="success" size="sm" />
              </Flex>
            </Col>
          </Row>
        ) : (
          <Button type="submit" color="primary" className="mt-3 w-100">
            Log in
          </Button>
        )}
      </Form.Group>

      <Divider className="mt-4">or log in with</Divider>

      <SocialAuthButtons loginLoading={loginLoading} setLoginLoading={handleLoginLoading} heading={heading} handleFirebaseError={handleFirebaseError} />
    </Form>
  );
};

export default LoginForm;
