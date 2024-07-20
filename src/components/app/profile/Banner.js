import React from 'react';
import { Col, Row } from 'react-bootstrap';
import ProfileBanner from './ProfileBanner';
import VerifiedBadge from 'components/common/VerifiedBadge';

const Banner = ({ userData }) => {

  return (
    <>
      {userData && <ProfileBanner>
        <ProfileBanner.Header avatar={userData} coverSrc={userData} />
        <ProfileBanner.Body>
          <Row>
            <Col lg={8}>
              <h4 className="mb-1">
                {userData.userName ? userData.userName : userData.userEmail} <VerifiedBadge />
              </h4>
              {userData.profileHeading && <h5 className="fs-0 fw-normal">
                {userData.profileHeading}
              </h5>}
            </Col>
          </Row>
        </ProfileBanner.Body>
      </ProfileBanner>}
    </>
  );
};

export default Banner;
