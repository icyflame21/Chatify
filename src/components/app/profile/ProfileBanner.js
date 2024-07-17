import React from 'react';
import { Card } from 'react-bootstrap';
import Background from 'components/common/Background';
import Avatar from 'components/common/Avatar';
import classNames from 'classnames';

const ProfileBannerHeader = ({ avatar, coverSrc, className }) => 
{
  const DefaultPic='https://i.ibb.co/pymdzwD/7.webp'
  const CoverPhoto='https://i.ibb.co/CMBWZ3y/5.webp'
  return (
    <Card.Header
      className={classNames(className, 'position-relative min-vh-25 mb-7')}
    >
      <Background image={coverSrc.userCoverPhoto ? coverSrc.userCoverPhoto : CoverPhoto} className="rounded-3 rounded-bottom-0" />
      <Avatar
        size="5xl"
        className="avatar-profile"
        src={avatar.userProfilePhoto ? avatar.userProfilePhoto : DefaultPic}
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
