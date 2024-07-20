import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import Avatar from 'components/common/Avatar';
import { signOut } from "firebase/auth"
import { auth } from 'config'
import AppContext from 'context/Context';
import DefaultProfile from 'assets/img/avatar.png'
import { showToast } from 'helpers/toast';
import { getAdminDoc } from 'helpers/query';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from 'config';

const ProfileDropdown = () => {
  const {
    userInfo,
    handleUserInfo,
    loading
  } = useContext(AppContext);

  const handleLogOut = async () => {
    const getAdmin = await getAdminDoc("User-Data", userInfo?.chat_group_options?.token_id);
    const currentUserRef = doc(firestore, "User-Data", userInfo?.uid);
    if (getAdmin?.uid == userInfo?.uid) {
      const payload = {
        chat_group_options: {
          group_image: userInfo?.chat_group_options.group_image,
          group_heading: userInfo?.chat_group_options.group_heading,
          group_name: userInfo?.chat_group_options.group_name,
          isLogout: true,
          isAdmin: false,
          admin_uid: userInfo?.uid,
          token_id: userInfo?.chat_group_options.token_id
        }
      };
      await updateDoc(currentUserRef, payload);
    }
    signOut(auth).then(() => {
      showToast('Logged out successfully', 'success');
      handleUserInfo({})
    }).catch((error) => {
      showToast(`${error.message}`, 'danger');
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
