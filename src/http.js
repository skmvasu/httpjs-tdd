import { stringify } from "query-string";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json"
};

const status = response => {
  if (response.ok) {
    return Promise.resolve(response);
  }

  return Promise.reject(new Error(response.statusText));
};

const deserializeResponse = response => response.json();
const encodeRequests = (params) => {

}

export const get = (url, params) => {
  const prefix = url.endsWith('/') ? url : `${url}/`;
  const queryString = params ? `?${stringify(params)}/` : '';
  return fetch(`${url}${queryString}`)
    .then(status)
    .then(deserializeResponse)
    .catch(error => Promise.reject(new Error(error)));
};
