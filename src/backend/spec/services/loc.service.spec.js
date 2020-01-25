const locService = require("../../services/loc.service");
const config = require('../../config');

let dataPath = config.mockDataPath;
let invalidPath = 'mockdata/notValid';
let actionIds = [5, 7, 9, 10, 12, 13, 14];

describe("Test loc.service.js", () => {

  it('getLocData should return loc data with 7 name:value pairs', (done) => {
    return locService.getLocData(actionIds, dataPath).then(function (result) {
      expect(Object.keys(result).length).toEqual(7);
      done();
    })
  });

  it('getLocData should return loc data and loc for id 7 and id 14 is empty', (done) => {
    return locService.getLocData(actionIds, dataPath).then(function (result) {
      expect(result['7']).toEqual([]);
      expect(result['14']).toEqual([]);
      done();
    });
  });

  it('getLocData should return loc data and valid entries and length for id 5', (done) => {
    return locService.getLocData(actionIds, dataPath).then(function (result) {
      expect(result['5'].length).toEqual(1617);
      expect(result['5'][0]).toEqual(29612);
      expect(result['5'][1616]).toEqual(7838);
      done();
    });
  });

  it('getLocData for empty actionIds array should return empty object', (done) => {
    return locService.getLocData([], dataPath).then(function (result) {
      expect(result).toEqual({});
      done();
    });
  });

  it('getLocData for invalid path should throw error', (done) => {
    return locService.getLocData(actionIds, invalidPath).then(function () {
      done(new Error('Promise should not be resolved'));
    }, function (error) {
      expect(error.status).toEqual(404);
      expect(error.message).toEqual("Directory 'coverage' does not exist.");
      done();
    });
  });
});
