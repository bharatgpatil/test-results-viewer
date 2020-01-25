const testsService = require("../../services/tests.service");

let dataPath = 'mockdata/data';
let mockDataPath = '../../../mockdata';
let invalidPath = 'mockdata/invalid';
let mockInvalidPath = '../../../mockdata/invalid';
let multipleCSVPath = 'mockdata/invalid/multipleCSV';

let filter = '.csv';

describe("Test tests.service.js", function () {

  it("scanDirectoryForCsvFiles should throw error for invalid path", function () {
    try {
      testsService.scanDirectoryForCsvFiles("invalid", filter);
    } catch (e) {
      expect(e.status).toEqual(404);
    }
  });

  it("scanDirectoryForCsvFiles should throw error for path with no CSV files", function () {
    try {
      testsService.scanDirectoryForCsvFiles(invalidPath, filter);
    } catch (e) {
      expect(e.status).toEqual(400);
    }
  });

  it("scanDirectoryForCsvFiles should throw error for path with multiple CSV files", function () {
    try {
      testsService.scanDirectoryForCsvFiles(multipleCSVPath, filter);
    } catch (e) {
      expect(e.status).toEqual(400);
    }
  });

  it("scanDirectoryForCsvFiles should return data for valid path", function () {
    let data = testsService.scanDirectoryForCsvFiles(dataPath, filter);
    expect(data.length).toEqual(1);
  });

  it("getTestsData should throw error for empty input", function () {
    try {
      testsService.getTestsData();
    } catch (e) {
      expect(e.status).toEqual(404);
    }
  });

  it("getTestsData should throw error for invalid path", function () {
    try {
      testsService.getTestsData(dataPath);
    } catch (e) {
      expect(e.status).toEqual(404);
    }
  });

  it("getTestsData should throw error for empty trace file", function () {
    try {
      testsService.getTestsData(mockInvalidPath);
    } catch (e) {
      expect(e.status).toEqual(400);
    }
  });

  it("getTestsData should return data for valid path with csv file", function () {
    let data = testsService.getTestsData(mockDataPath);
    expect(Object.keys(data).length).toEqual(31);
  });
});
