import React, { useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { auth } from 'config'
import { useForm } from 'react-hook-form';
import Flex from 'components/common/Flex';
import { sendPasswordResetEmail } from "firebase/auth";
import { LoginContext } from 'context/LoginProvider';
import { useNavigate } from 'react-router-dom';
import { showToast } from 'helpers/toast';

const ForgetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  const { loginLoading, handleLoginLoading } = useContext(LoginContext)
  const navigate = useNavigate();

  const onSubmit = data => {
    handleLoginLoading(true)
    sendPasswordResetEmail(auth, data.email)
      .then(() => {
        navigate('/')
        handleLoginLoading(false)
        reset()
        showToast('Password reset email sent!', 'success');
      })
      .catch((error) => {
        handleLoginLoading(false)
        showToast(`${error.message}`, 'danger');
      });
  };


  useEffect(() => {
    document.title = "Chatify | Forget Password";
  }, []);

  return (
    <Form className="mt-4" noValidate
      onSubmit={handleSubmit(onSubmit)}
      role="form">
      <Form.Group className="mb-3">
        <Form.Control
          placeholder={'email@domain.com'}
          name="email"
          type="email"
          disabled={loginLoading}
          isInvalid={!!errors.email}
          {...register('email', {
            required: 'Email Id is required',
            pattern: {
              value:
                /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/i,
              message: 'Email must be valid'
            }
          })
          }
        />
        <Form.Control.Feedback type="invalid">
          {errors.email && errors.email.message}
        </Form.Control.Feedback>
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
        ) : (<Button className="w-100" type="submit" >
          Send reset link
        </Button>)}
      </Form.Group>
    </Form>
  );
};

export default ForgetPasswordForm;
