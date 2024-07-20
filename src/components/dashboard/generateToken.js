import FalconCardHeader from 'components/common/FalconCardHeader'
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';
import React, { useContext, useState } from 'react'
import { Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import cloudUpload from 'assets/img/cloud-upload.svg';
import Avatar from 'components/common/Avatar';
import { GroupContext } from 'context/GroupProvider';
import AppContext from 'context/Context';
import { firestore } from 'config';
import { showToast } from 'helpers/toast';
import Flex from 'components/common/Flex';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import bg1 from 'assets/img/corner-5.png';

const GenerateToken = () => {
    const [avatarLoader, setAvatarLoader] = useState(false);
    const { group_loading, handleGroupLoading } = useContext(GroupContext);
    const { userInfo } = useContext(AppContext);

    const storage = getStorage();

    const generateShortToken = () => {
        const uuid = uuidv4();
        const shortToken = uuid.replace(/-/g, '').slice(0, 15);
        return shortToken;
    }

    const fetchHeading = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_RANDOM_PROFILE_HEADING_URL);
            return response.data.content
        } catch (error) {
            return ''
        }
    };

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            group_name: '',
            group_image: '',
            group_heading: ''
        }
    });


    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            acceptedFiles.forEach(file => {
                setAvatarLoader(true);
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    setAvatarLoader(false);
                    setValue('group_image', reader.result);
                };
            });
        }
    });

    const updateUserData = async (data, url) => {
        const documentRef = doc(firestore, "User-Data", userInfo.uid);
        const groupHeading = await fetchHeading();
        const payload = {
            chat_group_options: {
                group_image: url,
                group_heading: data.group_heading || groupHeading,
                group_name: data.group_name,
                isLogout: false,
                isAdmin: true,
                token_id: generateShortToken()
            }
        };
        await updateDoc(documentRef, payload);

        reset()
    };

    const onSubmit = async (data) => {
        handleGroupLoading(true);
        try {
            let url = '';
            if (watch('group_image')) {
                const userProfileAvatar = ref(storage, `${userInfo.userName}/Group_Image/`);
                await uploadString(userProfileAvatar, watch('group_image'), 'data_url');
                url = await getDownloadURL(userProfileAvatar);
            }
            await updateUserData(data, url);
            showToast(`Token generated successfully!`, 'success');
        } catch (err) {
            showToast(`Error: ${err.message}`, 'danger');
        } finally {
            handleGroupLoading(false);
        }
    };

    return (
        <Card>
            <FalconCardHeader title="Generate Token" />
            <Card.Body className="bg-light">
                <Form noValidate onSubmit={handleSubmit(onSubmit)} role="form">
                    <Row className="mb-3 g-3">
                        <Form.Group as={Col} lg={6} controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" disabled placeholder="Email Address" value={userInfo?.userEmail || ''} />
                        </Form.Group>
                        <Form.Group as={Col} lg={6} controlId="group_name">
                            <Form.Label>Group Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Group Name"
                                disabled={group_loading}
                                isInvalid={!!errors.group_name}
                                {...register('group_name', { required: '*Required' })}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.group_name && errors.group_name.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3" controlId="group_heading">
                        <Form.Label>Group Heading</Form.Label>
                        <Form.Control
                            type="text"
                            disabled={group_loading}
                            placeholder="Group Heading"
                            {...register('group_heading')}
                        />
                    </Form.Group>
                    <Row className="mb-3 align-items-center gap-2">
                        <Col sm="auto">
                            {avatarLoader ? (
                                <Row className="g-0 w-100 h-100">
                                    <Col xs={12} className="d-flex align-items-center justify-content-center">
                                        <Spinner animation="border" variant="primary" size="sm" />
                                    </Col>
                                </Row>
                            ) : (
                                <Avatar size="3xl" src={watch('group_image') ? watch('group_image') : bg1} />
                            )}
                        </Col>
                        {!group_loading && (
                            <Col md={6} {...getRootProps({ className: 'dropzone-area py-3' })}>
                                <input {...getInputProps()} disabled={group_loading} />
                                <Flex justifyContent="center">
                                    <img src={cloudUpload} alt="" width={25} className="me-2" />
                                    <p className="fs-0 mb-0 text-700">Upload Group photo</p>
                                </Flex>
                            </Col>
                        )}
                    </Row>
                    <div className="d-flex align-items-center justify-content-end">
                        {group_loading ? (
                            <Spinner animation="border" variant="success" size="sm" />
                        ) : (
                            <Button variant="falcon-success" type="submit" disabled={avatarLoader}>
                                Generate
                            </Button>
                        )}
                    </div>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default GenerateToken