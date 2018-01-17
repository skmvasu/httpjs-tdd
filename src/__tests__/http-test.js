import * as http from "../http.js";
import {stub, assert, mock} from "sinon";
import * as fetch from "isomorphic-fetch";

const url = "/api/v1/users/";

describe("TestHttpService", () => {
  describe("Test success scenarios", () => {
    let stubedFetch;
    
    beforeEach(() => {
      stubedFetch = stub(window, "fetch");
  
      window.fetch.returns(Promise.resolve(mockApiResponse()));
  
      function mockApiResponse(body = {}) {
        return new window.Response(JSON.stringify(body), {
          status: 200,
          headers: { "Content-Type": http.HTTP_HEADER_TYPES.json }
        });
      }
    });
  
    afterEach(() => {
      window.fetch.restore();
    }); 
    
    describe("Test get requests", () => {
      it("should make a GET request", done => {
        http.get(url).then(response => {
          expect(stubedFetch.calledWith(`${url}`)).toBeTruthy();
          expect(response).toEqual({});
          done();
        });
      });

      it("should serialize array parameter", done => {
        const users = [1, 2];
        const limit = 50;
        const isDetailed = false;
        const params = { users, limit, isDetailed };
        http
          .get(url, params)
          .then(response => {
            expect(stubedFetch.calledWith(`${url}?isDetailed=false&limit=50&users=1&users=2/`)).toBeTruthy();
            done();
          })
      });
    });

    ['post', 'put', 'patch'].map(verb => {

      describe(`Test ${verb} requests`, () => {
        let stubCSRF, csrf;
  
        beforeEach(() => {
          csrf = "CSRF";
          stub(http, "getCSRFToken").returns(csrf);
        });
  
        afterEach(() => {
          http.getCSRFToken.restore();
        });
  
        it("should send request with custom headers", done => {
          const postParams = { 
            users: [1, 2] 
          };
          http[verb](url, postParams, { contentType: http.HTTP_HEADER_TYPES.text })
            .then(response => {
              const [uri, params] = [...stubedFetch.getCall(0).args];
  
              expect(stubedFetch.calledWith(`${url}`)).toBeTruthy();
              expect(params.body).toEqual(jasmine.objectContaining(postParams));
  
              expect(params.headers.get("Content-Type")).toEqual(http.HTTP_HEADER_TYPES.text);
              done();
            });
        });
  
        it("should send request with CSRF", done => {
          const postParams = { 
            users: [1, 2 ] 
          };
          http[verb](url, postParams, {
              contentType: http.HTTP_HEADER_TYPES.text,
              includeCsrf: true 
            }).then(response => {
              const [uri, params] = [...stubedFetch.getCall(0).args];
  
              expect(stubedFetch.calledWith(`${url}`)).toBeTruthy();
              expect(params.body).toEqual(jasmine.objectContaining(postParams));
              expect(params.headers.get("Content-Type")).toEqual(http.HTTP_HEADER_TYPES.text);
              expect(params.headers.get("X-CSRF-Token")).toEqual(csrf);
  
              done();
            });
        });
  
        it("should send a form-encoded request", done => {
          const users = [1, 2];
          const limit = 50;
          const isDetailed = false;
          const postParams = { users, limit, isDetailed };
  
          http[verb](url, postParams, {
              contentType: http.HTTP_HEADER_TYPES.form,
              includeCsrf: true 
            }).then(response => {
              const [uri, params] = [...stubedFetch.getCall(0).args];
  
              expect(stubedFetch.calledWith(`${url}`)).toBeTruthy();
              expect(params.body).toEqual("isDetailed=false&limit=50&users=1&users=2");
              expect(params.headers.get("Content-Type")).toEqual(http.HTTP_HEADER_TYPES.form);
              expect(params.headers.get("X-CSRF-Token")).toEqual(csrf);

              done();
            });
        });
  
      });
    });
  });
});
