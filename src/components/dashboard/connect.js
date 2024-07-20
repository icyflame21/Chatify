import FalconCardHeader from 'components/common/FalconCardHeader';
import { firestore } from 'config';
import AppContext from 'context/Context';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { getAdminDoc } from 'helpers/query';
import { showToast } from 'helpers/toast';
import React, { useContext, useState } from 'react';
import { Button, Card, Form, FormControl, InputGroup, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { MdOutlineContentCopy } from "react-icons/md";
import './connectToken.css';
import { useNavigate } from 'react-router-dom';

const ConnectToken = () => {
  const { userInfo } = useContext(AppContext);
  const token_id = !userInfo?.chat_group_options?.admin_uid ? userInfo?.chat_group_options?.token_id ?? "" : "";
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    token: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    let common_member_obj = {};

    try {
      const getAdmin = await getAdminDoc("User-Data", formData.token);
      const AdminRef = doc(firestore, "User-Data", getAdmin?.uid);
      const currentUserRef = doc(firestore, "User-Data", userInfo?.uid);

      const common_chat_group_options = {
        group_image: getAdmin?.chat_group_options.group_image,
        group_heading: getAdmin?.chat_group_options.group_heading,
        group_name: getAdmin?.chat_group_options.group_name,
        isLogout: false,
        admin_uid: getAdmin?.uid,
        token_id: formData.token
      }

      if (getAdmin && getAdmin?.chat_group_options?.token_id === formData.token) {
        if (getAdmin?.uid === userInfo.uid) {
          common_member_obj = {
            name: getAdmin?.userName,
            image: getAdmin?.userProfilePhoto,
            email: getAdmin?.userEmail,
            uid: getAdmin?.uid,
            role: 'Admin'
          };
        } else {
          common_member_obj = {
            name: userInfo?.userName,
            image: userInfo?.userProfilePhoto,
            email: userInfo?.userEmail,
            uid: userInfo?.uid,
            role: 'Member'
          };
        }
        await updateDoc(AdminRef, {
          members_history: arrayUnion(common_member_obj)
        });
        let payload = {}
        if (getAdmin?.uid !== userInfo?.uid) {
          payload = {
            chat_group_options: {
              ...common_chat_group_options,
              isAdmin: false,
            }
          };
        } else {
          payload = {
            chat_group_options: {
              ...common_chat_group_options,
              isAdmin: true,
            }
          };
        }
        await updateDoc(currentUserRef, payload);

        showToast('Token successfully connected', 'success');
        navigate('/social')
      } else {
        showToast('No valid token found. Please check with admin.', 'danger');
      }
    } catch (error) {
      showToast(`No valid token found. Please check the token and try again.`, 'danger');
    } finally {
      setLoading(false);
      setFormData({ token: '', })
    }
  };

  const handleCopy = () => {
    if (token_id) {
      navigator.clipboard.writeText(token_id).then(() => {
        showToast('Token copied to clipboard successfully!', 'success');
      }).catch(err => {
        showToast(`Failed to copy token: ${err.message}`, 'warning');
      });
    }
  };

  return (
    <Card className="mb-3">
      <FalconCardHeader title="Connect" />
      <Card.Body className="bg-light">
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Generated Token"
              aria-label="Generated Token"
              disabled
              value={token_id}
            />
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip style={{ position: 'fixed' }}>
                  Copy Token
                </Tooltip>
              }
            >
              <Button variant="falcon-success" onClick={handleCopy} disabled={!token_id}>
                <MdOutlineContentCopy className="d-inline-block" />
              </Button>
            </OverlayTrigger>
          </InputGroup>

          <Form.Group className="mb-3" controlId="token">
            <Form.Label>Token</Form.Label>
            <Form.Control
              type="text"
              value={formData.token}
              name="token"
              onChange={handleChange}
              placeholder="Enter token here"
            />
          </Form.Group>

          <Button className="w-100" variant='falcon-success' type="submit" disabled={!formData.token || loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                <span>Connecting...</span>
              </>
            ) : (
              'Connect'
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ConnectToken;
