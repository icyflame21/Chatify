import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import GenerateToken from './generateToken';
import ConnectToken from './connect'
import PageHeader from 'components/common/PageHeader';

const Landing = () => {
  useEffect(() => {
    document.title = "Chatify | Dashboard";
  }, []);


  return (
    <>
      <PageHeader
        title="Invite Friends to Chat"
        description="Share your unique token with friends to start chatting instantly."
      />
      <Row className="g-3 mt-3">
        <Col lg={8} >
          <GenerateToken />
        </Col>
        <Col lg={4}>
          <div className="sticky-sidebar ">
            <ConnectToken />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Landing;
