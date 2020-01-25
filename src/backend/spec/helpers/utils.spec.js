const utils = require("../../helpers/utils");
const path = require('path');

let dataPath = 'mockdata/data';
let invalidPath = 'mockdata/notValid';
let invalidFile = 'mockdata/notValid.jpg';


describe("Test utils.js", function () {

  it('getFilesList should return loc files list', (done) => {
    let folderPath = path.join(dataPath, 'coverage');
    return utils.getFilesList(folderPath, "loc").then(function (result) {
      expect(result.length).toEqual(5);
      done();
    });
  });

  it('getFilesList should return state files list', (done) => {
    let folderPath = path.join(dataPath, 'states');
    return utils.getFilesList(folderPath, "states").then(function (result) {
      expect(result.length).toEqual(22);
      done();
    });
  });

  it('getFilesList should return image files list', (done) => {
    let folderPath = path.join(dataPath, 'images');
    return utils.getFilesList(folderPath, "images").then(function (result) {
      expect(result.length).toEqual(6);
      done();
    });
  });

  it('getFilesList should return error for no coverage directory', (done) => {
    return utils.getFilesList(invalidPath, "loc").then(function () {
      done(new Error('Promise should not be resolved'));
    }, function (error) {
      expect(error.status).toEqual(404);
      expect(error.message).toEqual("Directory 'coverage' does not exist.");
      done();
    });
  });

  it('getFilesList should return error for no images directory', (done) => {
    return utils.getFilesList(invalidPath, "images").then(function () {
      done(new Error('Promise should not be resolved'));
    }, function (error) {
      expect(error.status).toEqual(404);
      expect(error.message).toEqual("Directory 'images' does not exist.");
      done();
    });
  });

  it('getFilesList should return error for no states directory', (done) => {
    return utils.getFilesList(invalidPath, "states").then(function () {
      done(new Error('Promise should not be resolved'));
    }, function (error) {
      expect(error.status).toEqual(404);
      expect(error.message).toEqual("Directory 'states' does not exist.");
      done();
    });
  });

  it('base64_encode should return error for invalid file', function () {
    try {
      utils.base64_encode(invalidFile);
    } catch (e) {
      expect(e.status).toEqual(404);
    }
  });

  it('base64_encode should return string', function () {
    let result =  utils.base64_encode('mockdata/data/images/5.jpg');
    expect(result).toBeDefined();
  });
});

