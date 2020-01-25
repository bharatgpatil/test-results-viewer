fs = require('fs');

/**
 * @param path: path to directory coverage/ states/ images to extract files
 * @param type: "loc"/ "states"/ "images" to switch
 * @returns {Promise<unknown>} if Promise fulfilled, returns list of files; returns error if Promise is rejected
 */
async function getFilesList(path, type) {

  return new Promise(function (resolve, reject) {

    if (!fs.existsSync(path)) {
      let message;
      if (type === "loc") {
        message = "Directory 'coverage' does not exist.";
      }
      if (type === "states") {
        message = "Directory 'states' does not exist.";
      }
      if (type === "images") {
        message = "Directory 'images' does not exist.";
      }
      reject({
        message: message,
        path: path,
        status: 404
      })
    } else {
      let files = fs.readdirSync(path);
      let list = [];

      if (type === "loc") {
        files.forEach(function (file) {
          list.push(file);
        });
      } else if ((type === "states")) {
        files.forEach(function (file) {
          list.push(file.slice(0, -4));
        });
      } else if ((type === "images")) {
        files.forEach(function (file) {
          list.push(file.slice(0, -4));
        });
      }
      resolve(list);
    }
  });
}

/**
 * @param file: image file
 * @returns {string}: returns file data to base64 encoded string
 */
function base64_encode(file) {
  if (!fs.existsSync(file)) {
    throw {
      "message": "Image file does not exist.",
      "path": file,
      "status": 404
    }
  } else {
    let bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
  }
}

module.exports = {
  getFilesList,
  base64_encode
};
