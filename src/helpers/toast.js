import {  Slide, toast } from 'react-toastify';

const defaultOptions = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    transition: Slide,
    theme: 'colored',
    icon: false,
    className: 'w-auto gap-4',
};

export const showToast = (message, type) => {
    switch (type) {
        case 'success':
            toast.success(message, defaultOptions);
            break;
        case 'warning':
            toast.warn(message, defaultOptions);
            break;
        case 'danger':
            toast.error(message, defaultOptions);
            break;
        case 'info':
        default: break;
    }
};
