const tests = require("../../controllers/Tests");
const config = require('../../config');

let dataPath = config.mockDataPath;
let invalidPath = 'mockdata/data';


describe("Test Tests.js", function () {

  it("getAllTestsData should return data", (done) => {
    return tests.getAllTestsData(dataPath).then(function (result) {
      expect(Object.keys(result).length).toEqual(31);
      done();
    });
  });

  it("getAllTestsData should reject Promise for invalid path", (done) => {
    return tests.getAllTestsData(invalidPath).then(function () {
      done(new Error('Promise should not be resolved'));
    }, function (error) {
      expect(error.status).toEqual(404);
      done();
    });
  });
});
