const testsService = require('../services/tests.service');

/**
 * @param dataPath: path to the location of the test results
 * @returns {Promise<unknown>} if Promise is fulfilled, returns a JSON Object containing each row in the trace file
 * (action queues are handled correspondingly); in case of an error, the Promise is rejected
 */
async function getAllTestsData(dataPath) {
  return new Promise((resolve, reject) => {
    try {
      let testsData = testsService.getTestsData(dataPath);
      resolve(testsData);
    } catch (error) {
      reject({
        message: error.message,
        status: error.status
      })
    }
  })
}

module.exports = {
  getAllTestsData
};
