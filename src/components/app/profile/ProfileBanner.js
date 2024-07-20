import React from 'react';
import { Card } from 'react-bootstrap';
import Background from 'components/common/Background';
import Avatar from 'components/common/Avatar';
import classNames from 'classnames';
import CoverPhoto from 'assets/img/illustrations/13.jpg'
import DefaultProfile from 'assets/img/illustrations/avatar.png'

const ProfileBannerHeader = ({ avatar, coverSrc, className }) => 
{
  return (
    <Card.Header
      className={classNames(className, 'position-relative min-vh-25 mb-7')}
    >
      <Background image={coverSrc.userCoverPhoto ? coverSrc.userCoverPhoto : CoverPhoto} className="rounded-3 rounded-bottom-0" style={{objectFit:"contain"}} />
      <Avatar
        size="5xl"
        className="avatar-profile"
        src={avatar.userProfilePhoto ? avatar.userProfilePhoto : DefaultProfile}
        mediaClass="img-thumbnail shadow-sm"
      />
    </Card.Header>
  );
};

const ProfileBannerBody = ({ children }) => {
  return <Card.Body>{children}</Card.Body>;
};

const ProfileBanner = ({ children }) => {
  return <Card className="mb-3">{children}</Card>;
};

ProfileBanner.Header = ProfileBannerHeader;
ProfileBanner.Body = ProfileBannerBody;

export default ProfileBanner;
