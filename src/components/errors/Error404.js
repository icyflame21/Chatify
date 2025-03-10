import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {
  const navigate = useNavigate()
  return (
    <>
      <Card className="text-center">
        <Card.Body className="p-5">
          <div className="display-1 text-300 fs-error">404</div>
          <p className="lead mt-4 text-800 font-sans-serif fw-semi-bold">
            The page you're looking for is not found.
          </p>
          <hr />
          <p>
            Make sure the address is correct and that the page hasn't moved. If
            you think this is a mistake,
            <a href="mailto:hi@biswaranjan.in" className="ms-1">
              contact us
            </a>
            .
          </p>
          <Button className="btn-sm mt-3" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faHome} className="me-2" />
            Take me home
          </Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default Error404;
