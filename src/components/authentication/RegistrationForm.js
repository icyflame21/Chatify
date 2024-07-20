import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from 'config';
import { useForm } from 'react-hook-form';
import Flex from 'components/common/Flex';
import { LoginContext } from 'context/LoginProvider';
import { showToast } from 'helpers/toast';

const RegistrationForm = () => {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const { loginLoading, handleLoginLoading } = useContext(LoginContext);

  const onSubmit = async (data) => {
    handleLoginLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      await sendEmailVerification(auth.currentUser);
      showToast('Successfully registered. Please verify your email', 'success');
      reset()
    } catch (error) {
      showToast(error.message.replace('Firebase: ', ''), 'error');
    } finally {
      handleLoginLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Chatify | Register';
  }, []);

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)} role="form">
      <Form.Group className="mb-3">
        <Form.Control
          placeholder='email@domain.com'
          name="email"
          type="email"
          disabled={loginLoading}
          isInvalid={!!errors.email}
          {...register('email', {
            required: 'Email Id is required',
            pattern: {
              value: /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/i,
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
          placeholder='Password'
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
            pattern: {
              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/,
              message: 'Password should be strong (Use special characters)',
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password && errors.password.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Control
          placeholder='Confirm Password'
          name="confirmPassword"
          type="password"
          disabled={loginLoading}
          isInvalid={!!errors.confirmPassword}
          {...register('confirmPassword', {
            required: 'You must confirm your password',
            validate: value => value === watch('password') || 'Passwords do not match',
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.confirmPassword && errors.confirmPassword.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check type="checkbox" className="form-check">
          <Form.Check.Input
            type="checkbox"
            name="isAccepted"
            disabled={loginLoading}
            isInvalid={!!errors.isAccepted}
            {...register('isAccepted', {
              required: 'You need to agree to the terms and privacy policy.',
            })}
          />
          <Form.Check.Label className="form-label">
            I accept the <Link to="#!">terms</Link> and{' '}
            <Link to="#!">privacy policy</Link>
          </Form.Check.Label>
          <Form.Control.Feedback type="invalid">
            {errors.isAccepted && errors.isAccepted.message}
          </Form.Control.Feedback>
        </Form.Check>
      </Form.Group>

      <Form.Group>
        {loginLoading ? (
          <Row className="g-0">
            <Col xs={12} className="w-100 h-100 my-3">
              <Flex className="align-items-center justify-content-center">
                <Spinner animation="border" variant="success" size='sm' />
              </Flex>
            </Col>
          </Row>
        ) : (
          <Button className="w-100" type="submit">
            Register
          </Button>
        )}
      </Form.Group>
    </Form>
  );
};

export default RegistrationForm;
