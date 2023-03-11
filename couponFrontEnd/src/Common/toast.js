import 'react-toastify/dist/ReactToastify.css';

import { toast } from "react-toastify";

export const toastError = (msg) => {
    toast.error(msg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

export const toastSuccess = (msg) => {
    toast.success(msg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};