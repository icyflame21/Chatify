import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import Avatar from 'components/common/Avatar';
import { signOut } from "firebase/auth"
import { auth } from 'config'
import { toast } from 'react-toastify';
import AppContext from 'context/Context';
import DefaultProfile from 'assets/img/illustrations/avatar.png'

const ProfileDropdown = () => {
  const {
    userInfo,
    handleUserInfo,
    loading
  } = useContext(AppContext);

  const handleLogOut = () => {
    signOut(auth).then(() => {
      toast.success(`Logged out successfully`, {
        theme: 'colored'
      });
      handleUserInfo({})
    }).catch((error) => {
      toast.error(`${error.message}`, {
        theme: 'colored'
      });
    });
  }

  return (
    <>
      {loading ? '' : <Dropdown navbar={true} as="li">
        <Dropdown.Toggle
          bsPrefix="toggle"
          className="pe-0 ps-2 nav-link bg-transparent border-0 shadow-none"
        >
          <Avatar src={userInfo.userProfilePhoto ?? userInfo.photoURL ?? DefaultProfile} size="xl" className="status-online" />
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-caret dropdown-menu-card  dropdown-menu-end">
          <div className="bg-white rounded-2 py-2 dark__bg-1000">
            <Dropdown.Item as={Link} to={`/profile`}>
              {userInfo.userName ?? userInfo.userEmail}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleLogOut()}>
              Logout
            </Dropdown.Item>
          </div>
        </Dropdown.Menu>
      </Dropdown>}
    </>

  );
};

export default ProfileDropdown;
