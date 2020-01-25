let loc = require("../../controllers/LoC");
let config = require('../../config');

let dataPath = config.mockDataPath;
let invalidPath = 'mockdata/notValid';
let actionIds = [5, 7, 9, 10, 12, 13, 14];

describe("Test LoC.js", function () {

  it("getActionIdsLoC should return loc data", (done) => {
    return loc.getActionIdsLoC(actionIds, dataPath).then(function (result) {
      expect(Object.keys(result).length).toEqual(7);
      done();
    });
  });

  it('getActionIdsLoC for invalid path should throw error', (done) => {
    return loc.getActionIdsLoC(actionIds, invalidPath).then(function () {
      done(new Error('Promise should not be resolved'));
    }, function (error) {
      expect(error.status).toEqual(404);
      expect(error.message).toEqual("Directory 'coverage' does not exist.");
      done();
    });
  });
});
