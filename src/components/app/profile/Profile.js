import React from 'react';
import ProfileBanner from './Banner';
import { Col, Row, Spinner } from 'react-bootstrap';
import { useEffect } from 'react';
import { useContext } from 'react';
import AppContext from 'context/Context';

const Profile = () => {
  const { loading, userInfo } = useContext(AppContext);

  useEffect(() => {
    document.title = "Chatify | Profile";
  }, [])


  return (
    <>
      {loading ?
        <Row className="g-0 w-100 h-100" >
          <Col xs={12} className='d-flex align-items-center justify-content-center' style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
            <Spinner animation="border" variant="success" size='sm' />
          </Col>
        </Row> : <>
          {Object.keys(userInfo).length > 0 && <ProfileBanner userData={userInfo} />}
        </>}
    </>
  );
};

export default Profile;
