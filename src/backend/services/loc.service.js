const utils = require('../helpers/utils');

let path = require('path'),
  fs = require('fs');

/**
 * @param ids: array of actionIds
 * @param dataPath: path to the location of the test results
 * @returns {Promise<void>}: if Promise fulfilled; returns locMap of type Object with 'id':loc pairs,
 * where loc is an array containing the code lines, or an empty object if actionIds is an empty array;
 * throws an error if Promise is rejected
 */
async function getLocData(ids, dataPath) {
  let folderPath;
  if (path.isAbsolute(dataPath)) {
    folderPath = path.join(dataPath, 'data', 'coverage');
  } else {
    folderPath = path.join(__dirname, dataPath, 'data', 'coverage');
  }

  let coverageFiles;
  try {
    coverageFiles = await utils.getFilesList(folderPath, "loc");
  } catch (error) {
      throw {
        message: error.message,
        path: error.path,
        status: error.status
      }
  }

  let locMap = {};
  for (let j = 0; j < ids.length; j++) {
    let loc = [];
    let count = 0;
    for (let i = 0; i < coverageFiles.length; i++) {
      if ((parseInt(coverageFiles[i].match(/(\d+)/), 10)) === ids[j]) {
        count++;
        let filePath = path.join(folderPath, coverageFiles[i]);
        let array = fs.readFileSync(filePath).toString().split("\n");
        if (array && array.length > 0) {
          for (let k = 0; k < array.length - 1; k++) {
            loc.push(parseInt(array[k].toString().split(";")[0]));
          }
        }
        locMap[ids[j]] = loc;
        break;
      }
    }
    if (count === 0) {
      locMap[ids[j]] = loc;
    }
  }
  return locMap;
}

module.exports = {
  getLocData
};
