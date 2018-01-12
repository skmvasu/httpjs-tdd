import * as http from "../http.js";
import {stub, assert} from "sinon";
import * as fetch from "isomorphic-fetch";

let stubedFetch; 

const url = "/api/v1/users/";

describe("TestHttpService", () => {
  describe("Test success scenarios", () => {
    beforeEach(() => {
      stubedFetch = stub(window, "fetch");

      window.fetch.returns(Promise.resolve(mockApiResponse()));

      function mockApiResponse(body = {}) {
        return new window.Response(JSON.stringify(body), {
          status: 200,
          headers: { "Content-type": "application/json" }
        });
      }
    });

    afterEach(() => {
      window.fetch.restore();
    }); 

    describe("Test get requests", () => {
      it("should make a GET request", done => {
        http.get(url).then(response => {
          console.log(stubedFetch.getCall(0).args[0]);
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
});
