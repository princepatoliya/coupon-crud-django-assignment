import axios from "axios";
import { toastError } from "./toast";

export const request = (request) => {
  return new Promise((resolve, reject) => {
    axios(request)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        if (error.response.data.errors[0]) {
          toastError(error.response.data.errors[0]);
        }
        toastError(error.message);
        reject(new Error(error.status, error.message));
      });
  });
};

export const _get = async (url, params, headers) => {
  return request({ url, params, headers, method: "GET" });
};

export const _post = async (url, params, data, headers) => {
  return request({ url, params, data, headers, method: "POST" });
};

export const _put = async (url, params, data, headers) => {
  return request({ url, params, data, headers, method: "PUT" });
};

export const _delete = async (url, params, data, headers) => {
  return request({ url, params, data, headers, method: "DELETE" });
};

export const _patch = async (url, params, data, headers) => {
  return request({ url, params, data, headers, method: "PATCH" });
};
