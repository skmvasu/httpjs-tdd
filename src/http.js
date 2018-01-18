import { stringify } from "query-string";

export const HTTP_HEADER_TYPES = {
  json: "application/json",
  text: "application/text",
  form: "application/x-www-form-urlencoded",
  multipart: "multipart/form-data"
};

const status = response => {
  if (response.ok) {
    return Promise.resolve(response);
  }

  return Promise.reject(new Error(response.statusText));
};

const deserializeResponse = response => response.json();
const encodeRequests = (params, contentType) => {

  switch (contentType) {
    case HTTP_HEADER_TYPES.form: {
      return stringify(params);
    }
    case HTTP_HEADER_TYPES.multipart: {
      var formData = new FormData();

      for (var k in params) {
        formData.append(k, params[k]);
      }

      return formData;
    }
    
    default:
      return JSON.stringify(params);
  }
}

export const get = (url, params) => {
  const prefix = url.endsWith('/') ? url : `${url}/`;
  const queryString = params ? `?${stringify(params)}/` : '';
  return fetch(`${url}${queryString}`)
    .then(status)
    .then(deserializeResponse)
    .catch(error => Promise.reject(new Error(error)));
};

export const post = (url, params, options = {}) => request(url, params, options, 'post');
export const patch = (url, params, options = {}) => request(url, params, options, 'patch');
export const put = (url, params, options = {}) => request(url, params, options, 'put');

const request = (url, params, options={}, method="post") => {
  const {includeCsrf, contentType} = options;

  const headers = new Headers();

  headers.append("Content-Type", contentType || HTTP_HEADER_TYPES.json);


  if (includeCsrf) {
    headers.append("X-CSRF-Token", getCSRFToken());
  }

  return fetch(url, {
    headers,
    method,
    body: encodeRequests(params, contentType)
  });
};

export const getCSRFToken = () => {
  return "CSRF";
};