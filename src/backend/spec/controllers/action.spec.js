const action = require("../../controllers/Action");
const config = require('../../config');

let dataPath = config.mockDataPath;
let invalidPath = 'inavlid';
let invalidPathImages = '../../../mockdata/invalid/noImagesDir';
let invalidPathStates = '../../../mockdata/invalid/noWidgetsDir';

describe("Test Action.js", function () {

  it("getSelectedActionIdData should return action data", function (done) {
    return action.getSelectedActionIdData('9', dataPath).then(function (result) {
      expect(Object.keys(result).length).toEqual(14);
      done();
    });
  });

  it("getSelectedActionIdData should return empty object for invalid id", function (done) {
    return action.getSelectedActionIdData('invalid', dataPath).then(function (result) {
      expect(result).toEqual({});
      done();
    });
  });

  it("getSelectedActionIdData should throw error for invalid path", function (done) {
    return action.getSelectedActionIdData('9', invalidPath).then(function () {
      done(new Error('Promise should not be resolved'));
    }, function (error) {
      expect(error.status).toEqual(404);
      expect(error.message).toEqual("Directory does not exist or does not contain any data.");
      done();
    });
  });

  it("getSelectedActionIdData should throw error for no images directory", function (done) {
    return action.getSelectedActionIdData('9', invalidPathImages).then(function () {
      done(new Error('Promise should not be resolved'));
    }, function (error) {
      expect(error.status).toEqual(404);
      expect(error.message).toEqual("Directory 'images' does not exist.");
      done();
    });
  });

  it("getSelectedActionIdData should throw error for no states directory", function (done) {
    return action.getSelectedActionIdData('9', invalidPathStates).then(function () {
      done(new Error('Promise should not be resolved'));
    }, function (error) {
      expect(error.status).toEqual(404);
      expect(error.message).toEqual("Directory 'states' does not exist.");
      done();
    });
  });
});
