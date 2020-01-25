const actionService = require("../../services/action.service");
const config = require('../../config');

let dataPath = config.mockDataPath;
let invalidPath = 'mockdata/notValid';
let jsonPath = config.mockJsonPath;
let data = require(jsonPath);

describe("Test action.service.js", function () {

  it('getImagesData should return image data for action_7 and action_9', function (done) {
    return actionService.getImagesData(data.mockdata.action_7, data.mockdata.action_9, dataPath)
      .then(function (result) {
        expect(Object.keys(result).length).toEqual(2);
        done();
      });
  });

  it('getImagesData should throw error for invalid path', (done) => {
    return actionService.getImagesData(data.mockdata.action_7, data.mockdata.action_9, invalidPath).then(function () {
      done(new Error('Promise should not be resolved'));
    }, function (error) {
      expect(error.status).toEqual(404);
      expect(error.message).toEqual("Directory 'images' does not exist.");
      done();
    });
  });

  it('getWidgetsData should return widget data for action_9', function (done) {
    return actionService.getWidgetsData(data.mockdata.action_9.SourceState, dataPath).then(function (result) {
      expect(result.length).toEqual(45);
      done();
    });
  });

  it('getWidgetsData should throw error for invalid path', (done) => {
    return actionService.getWidgetsData(data.mockdata.action_9.SourceState, invalidPath).then(function () {
      done(new Error('Promise should not be resolved'));
    }, function (error) {
      expect(error.status).toEqual(404);
      expect(error.message).toEqual("Directory 'states' does not exist.");
      done();
    });
  });

  it('getWidgetsData should return undefined for non-existing SourceState', function (done) {
    return actionService.getWidgetsData("", dataPath).then(function (result) {
      expect(result).toEqual(undefined);
      done();
    });
  });

  it('getInteractedWidget should return interacted widget data for action_9', function () {
    let interactedWidgetId = data.mockdata.action_9.InteractedWidget;
    let widgets = data.mockdata.widgets;
    let result = actionService.getInteractedWidget(widgets, interactedWidgetId);
    expect(result.UniqueId).toEqual(interactedWidgetId);
  });

  it('getInteractedWidget should return undefined for empty widget list', function () {
    let interactedWidgetId = data.mockdata.action_9.InteractedWidget;
    let result = actionService.getInteractedWidget([], interactedWidgetId);
    expect(result).toEqual(undefined);
  });

  it('getInteractedWidget should return undefined for empty interacted widget', function () {
    let widgets = data.mockdata.widgets;
    let result = actionService.getInteractedWidget(widgets, "");
    expect(result).toEqual(undefined);
  });

  it('getInteractedWidget should return undefined for non-existing interacted widget', function () {
    let widgets = data.mockdata.widgets;
    let result = actionService.getInteractedWidget(widgets, 'invalid');
    expect(result).toEqual(undefined);
  });
});
