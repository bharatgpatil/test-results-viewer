const locService = require('../services/loc.service')

/**
 * @param ids: array of actionIds
 * @param dataPath: path to the location of the test results
 * @returns {Promise<void>}: if Promise fulfilled; returns locMap of type Object with 'id':loc pairs,
 * where loc is an array containing the code lines, or an empty object if actionIds is an empty array;
 * throws an error if Promise is rejected */
async function getActionIdsLoC(ids, dataPath) {
  try {
    return await locService.getLocData(ids, dataPath);
  } catch (error) {
    throw {
      message: error.message,
      path: error.path,
      status: error.status
    }
  }
}

module.exports = {
  getActionIdsLoC
};
