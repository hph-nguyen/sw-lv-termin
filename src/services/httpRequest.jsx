import axios from "axios";

//Kommunikation mit REST-Api via get/post etc.
// es muss die basicAuth mitgegeben werden

// URL from API Test Localhost
const httpRequest = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/**
 * GET
 * @param {*} path
 * @param {*} options
 * @returns
 */
// in den options wird meist die Auth mitgegeben (basicAuth)
export const get = async (path, options = {}) => {
  const response = await httpRequest.get(path, options);
  return response;
};

/**
 * POST
 * @param {*} path
 * @param {*} data
 * @param {*} options
 * @returns
 */
export const post = async (path, data, options = {}) => {
  const response = await httpRequest.post(path, data, options);
  return response;
};

/**
 * PUT
 * @param {*} path
 * @param {*} data
 * @param {*} options
 * @returns
 */
export const put = async (path, data, options = {}) => {
  const response = await httpRequest.put(path, data, options);
  return response;
};

export const basicAuthen = (user) => ({
  withCredentials: true,
  auth: {
    username: user.uid,
    password: user.pw,
  },
  crossdomain: true,
});

export default httpRequest;
