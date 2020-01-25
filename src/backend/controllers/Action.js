const actionService = require('../services/action.service');
const testsService = require('../services/tests.service');

let actionData = {};
let imagesData = {
  sourceStateImage: "",
  resultingStateImage: ""
};
let widgets = [];
let path;
let interactedWidgetData = {};

/**
 * @param id: id of the action
 * @param dataPath: path to the location of the test results
 * @returns {Promise<void>} if fulfilled, returns the data computed for the action or {} if id is invalid;
 * throws error if Promise is rejected
 */
async function getSelectedActionIdData(id, dataPath) {
  path = dataPath;
  actionData = {};
  try {
    await computeJsonDataForAction(id);
    return actionData;
  } catch (error) {
    throw {
      message: error.message,
      path: error.path,
      status: error.status
    }
  }
}

/**
 * setter for computed data of the action
 */
function setSelectedActionIdData() {
  actionData.widgets = widgets;
  actionData.sourceStateImage = imagesData.sourceStateImage;
  actionData.resultingStateImage = imagesData.resultingStateImage;
  actionData.interactedWidgetData = interactedWidgetData;
}

/**
 * @param id: id of the action
 * @returns {Promise<void>} if fulfilled, returns the computed data for the
 * images, widgets and the interacted widget of the action; throws error if rejected
 */
async function computeJsonDataForAction(id) {

  let jsonData;
  try {
    jsonData = testsService.getTestsData(path);
  } catch (error) {
    throw {
      "message": error.message,
      "path": path,
      "status": error.status
    };
  }

  if (jsonData && jsonData.length) {
    for (let i = 0; i < jsonData.length; i++) {
      if (jsonData[i]["Action-Id"] === id) {
        let sourceStateData = jsonData[i - 1];
        actionData = jsonData[i];
        let resultingStateData = jsonData[i];
        try {
          imagesData = await actionService.getImagesData(sourceStateData, resultingStateData, path);
        } catch (error) {
          throw {
            message: error.message,
            path: error.path,
            status: error.status
          }
        }
        try {
          widgets = await actionService.getWidgetsData(actionData.SourceState, path);
        } catch (error) {
          throw {
            message: error.message,
            path: error.path,
            status: error.status
          }
        }

        interactedWidgetData = actionService.getInteractedWidget(widgets, jsonData[i].InteractedWidget);

        if (jsonData[i].InteractedWidget && widgets.length > 0) {
          for (let j = 0; j < widgets.length; j++) {
            if (jsonData[i].InteractedWidget === widgets[j].UniqueId) {
              widgets.splice(j,1);
            }
          }
        }
        setSelectedActionIdData();
        return;
      }
    }
  }
}

module.exports = {
  getSelectedActionIdData
};
