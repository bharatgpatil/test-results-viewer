const path = require('path');
const fs = require('fs');
const csvToJson = require('convert-csv-to-json');

/**
 * @param startPath: path to 'data' directory
 * @param filter: property '.csv' to filter files
 * @returns {[]}: array containing the filename of the trace file or throws an error
 */
function scanDirectoryForCsvFiles(startPath, filter) {
  let results = [];
  if (!fs.existsSync(startPath)) {
    throw {
      "message": "Directory does not exist or does not contain any data.",
      "path": startPath,
      "status": 404
    };
  } else {
    let files = fs.readdirSync(startPath);

    for (let i = 0; i < files.length; i++) {
      let filename = path.join(startPath, files[i]);
      if (filename.indexOf(filter) >= 0) {
        results.push(filename);
      }
    }

    if (results.length !== 1) {
      throw {
        "message": "Directory contains multiple CSV trace files or no CSV trace file at all.",
        "path": startPath,
        "status": 400
      };
    }
    return results;
  }
}

/**
 * @param dataPath: path to the location of the test results
 * @returns {Array}: JSON Object containing each row in the trace file (action queues are handled correspondingly)
 * as a value or throws an error
 */
function getTestsData(dataPath) {
  if (dataPath) {
    let traceFilePath;

    if (path.isAbsolute(dataPath)) {
      traceFilePath = path.join(dataPath, 'data');
    } else {
      traceFilePath = path.join(__dirname, dataPath, 'data');
    }

    let results;
    try {
      results = scanDirectoryForCsvFiles(traceFilePath, '.csv');
    } catch (error) {
      throw {
        "message": error.message,
        "path": traceFilePath,
        "status": error.status
      };
    }

    if (results) {
      let jsonData = csvToJson.getJsonFromCsv(results[0]);
      if (!jsonData || jsonData.length === 0) {
        throw {
          "message": "CSV file is empty.",
          "path": traceFilePath,
          "status": 400
        };
      } else {
        for (let i = 0; i < jsonData.length; i++) {
          if (jsonData[i].Action === "ActionQueue-START") {
            let startIndex = i;
            let count = 1;
            let j = i;
            for (j; j < jsonData.length; j++) {
              if (jsonData[j].Action === "ActionQueue-End") {
                jsonData.splice(startIndex, count - 1);
                break;
              } else {
                count++;
              }
            }
          }
        }
      }
      return jsonData;
    }

  } else {
    throw {
      "message": "Empty input: path does not exist.",
      "path": dataPath,
      "status": 404
    };
  }
}

module.exports = {
  getTestsData,
  scanDirectoryForCsvFiles
};
