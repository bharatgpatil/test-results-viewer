const server = require("../../app.js");
const request = require('request');
const config = require('../../config');

let dataPath = config.mockDataPath;
let actionIds = [5, 7, 9, 10, 12, 13, 14];

describe("tests routes", function () {
  let serverInstance;

  beforeEach(function (done) {
    serverInstance = server.run(done);
  });

  afterEach(function (done) {
    serverInstance.close(done);
  });

  it("GET should respond with OK", function (done) {
    request.get('http://localhost:4400/', function (error, response) {
      expect(response.body).toEqual('{"status":"OK!"}');
      done();
    });
  });

  it("POST should fail", function (done) {
    request.post('http://localhost:4400/', {json: true, body: {}}, function (error, response) {
      expect(response.statusCode).toEqual(404);
      done();
    });
  });

  it("POST getTestsData should return data", function (done) {
    request.post('http://localhost:4400/getTestsData', {
      json: true, body: {
        path: dataPath
      }
    }, function (error, response) {
      expect(response.statusCode).toEqual(200);
      expect(Object.keys(response.body).length).toEqual(31);
      done();
    });
  });

  it("POST getActionDataForId/9 should return data", function (done) {
    request.post('http://localhost:4400/getActionDataForId/9', {
      json: true, body: {
        path: dataPath
      }
    }, function (error, response) {
      expect(response.statusCode).toEqual(200);
      expect(Object.keys(response.body).length).toEqual(14);
      done();
    });
  });

  it("POST getLoCDataForIds should return data", function (done) {
    request.post('http://localhost:4400/getLoCDataForIds', {
      json: true, body: {
        path: dataPath,
        ids: actionIds
      }
    }, function (error, response) {
      expect(response.statusCode).toEqual(200);
      expect(Object.keys(response.body).length).toEqual(7);
      done();
    });
  });

  it("POST getActionDataForId/50 should return empty object", function (done) {
    request.post('http://localhost:4400/getActionDataForId/50', {
      json: true, body: {
        path: dataPath
      }
    }, function (error, response) {
      expect(response.body).toEqual({});
      done();
    });
  });

  it("POST getTestsData should throw error for invalid path", function (done) {
    request.post('http://localhost:4400/getTestsData', {
      json: true, body: {
        path: "invalid"
      }
    }, function (error, response) {
      expect(response.statusCode).toEqual(404);
      done();
    });
  });

  it("POST getTestsData should throw error for empty path", function (done) {
    request.post('http://localhost:4400/getTestsData', {
      json: true, body: {
        path: ""
      }
    }, function (error, response) {
      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Empty input: path does not exist.");
      done();
    });
  });

  it("POST getLoCDataForIds should throw error for empty path", function (done) {
    request.post('http://localhost:4400/getLoCDataForIds', {
      json: true, body: {
        path: "",
        ids: actionIds
      }
    }, function (error, response) {
      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Directory 'coverage' does not exist.");
      done();
    });
  });

  it("POST getActionDataForId/9 should throw error for empty path", function (done) {
    request.post('http://localhost:4400/getActionDataForId/9', {
      json: true, body: {
        path: ""
      }
    }, function (error, response) {
      expect(response.statusCode).toEqual(404);
      done();
    });
  });

});
