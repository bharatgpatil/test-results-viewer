const utils = require('../helpers/utils');

let path = require('path');
let csvToJson = require('convert-csv-to-json');

/**
 * @param source: data of the sourceState of the action
 * @param resulting: data of the resultingState of the following action
 * @param dataPath: path to the location of the test results
 * @returns {Promise<{sourceStateImage: string, resultingStateImage: string}>}: if fulfilled, returns the data of these screenshots;
 * throws an error if Promise is rejected
 */
async function getImagesData(source, resulting, dataPath) {
  let imageFilesPath;
  if (path.isAbsolute(dataPath)) {
    imageFilesPath = path.join(dataPath, 'data', 'images');
  } else {
    imageFilesPath = path.join(__dirname, dataPath, 'data', 'images');
  }

  let imagesFiles;
  try {
    imagesFiles = await utils.getFilesList(imageFilesPath, "images");
  } catch (error) {
    throw {
      message: error.message,
      path: error.path,
      status: error.status
    }
  }

  let sourceActionId, resultingActionId;

  if (source) {
    sourceActionId = source["Action-Id"];
  }

  if (resulting) {
    resultingActionId = resulting["Action-Id"];
  }

  let data = {
    sourceStateImage: "",
    resultingStateImage: ""
  };

  if (imagesFiles && imagesFiles.length > 0) {
    for (let j = 0; j < imagesFiles.length; j++) {
      if (imagesFiles[j] === sourceActionId) {
        let image = imageFilesPath + "/" + sourceActionId + ".jpg";
        data.sourceStateImage = utils.base64_encode(image);
      } else if (imagesFiles[j] === resultingActionId) {
        let image = imageFilesPath + "/" + resultingActionId + ".jpg";
        data.resultingStateImage = utils.base64_encode(image);
      }
    }
  }
  return data;
}

/**
 * @param sourceState: identification string to determine the widgets of the action
 * @param dataPath: path to the location of the test results
 * @returns {Promise<unknown>} if fulfilled, returns the data for all widgets of the actions as a list or undefined if
 * the source state cannot be found in the states directory; throws an error if Promise is rejected
 */
async function getWidgetsData(sourceState, dataPath) {
  let folderPath;
  if (path.isAbsolute(dataPath)) {
    folderPath = path.join(dataPath, 'data', 'states');
  } else {
    folderPath = path.join(__dirname, dataPath, 'data', 'states');
  }

  let stateFiles;
  try {
    stateFiles = await utils.getFilesList(folderPath, "states");
  } catch (error) {
    throw {
      message: error.message,
      path: error.path,
      status: error.status
    }
  }

  let widgetData;
  if (stateFiles && stateFiles.length > 0) {
    for (let j = 0; j < stateFiles.length; j++) {
      if (stateFiles[j] === sourceState || stateFiles[j] === (sourceState + '_HS')) {
        let stateFilePath;
        if (path.isAbsolute(dataPath)) {
          stateFilePath = path.join(dataPath, 'data', 'states');
        } else {
          stateFilePath = path.join(__dirname, dataPath, 'data', 'states');
        }
        let srcPath = path.join(stateFilePath, stateFiles[j] + '.csv');
        widgetData = csvToJson.getJsonFromCsv(srcPath);
        break;
      }
    }
  }
  return widgetData;
}

/**
 * @param widgets: list of widgets of the action
 * @param interactedWidget: widget, which interacted with the action
 * @returns {*} returns the data of the with the action interacting widget if it exists
 */
function getInteractedWidget(widgets, interactedWidget) {
  if (interactedWidget && widgets.length > 0) {
    for (let i = 0; i < widgets.length; i++) {
      if (interactedWidget === widgets[i].UniqueId) {
        return widgets[i];
      }
    }
  }
}

module.exports = {
  getImagesData,
  getWidgetsData,
  getInteractedWidget
};
