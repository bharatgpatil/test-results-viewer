import {Component, OnInit, ViewChild} from '@angular/core';
import {TimelineComponent} from "../../components/timeline/timeline.component";
import {ApiService} from '../../api.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  public path;
  public testsData: any;
  public actionIds = [];
  public actionId: any;
  private sourceStateImg: any;
  private resultingStateImg: any;
  private widgets = [];
  private status: string;
  private interactedWidgetId: any;
  private interactedWidgetData: any;
  private loc: [];
  public actionTestData: any;
  public locMap: any;
  public pathValue: string;
  public loader = false;
  public hide = true;
  public errorText = {};
  public showWelcomeScreen = true;

  @ViewChild(TimelineComponent)
  timeLine: TimelineComponent = new TimelineComponent();

  sendActionIdEventHandler($event: any) {
    this.setActionId($event);
  }

  constructor(private apiService: ApiService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.openFileDialog();
    this.showWelcomeMessage();
  }

  public showWelcomeMessage() {
    if (this.testsData === undefined) {
      this.showWelcomeScreen = true;
      this.errorText["message"] = "Please select a directory or enter directory path in the input field to visualize the test results.";
      this.errorText["type"] = "info";
    } else {
      this.showWelcomeScreen = false;
      this.errorText = {};
    }
  }

  /**
   * file chooser for relative path in application
   */
  private openFileDialog() {
    const fileLoader = document.getElementById("fileLoader");
    if (fileLoader) {
      fileLoader.click();
    }
  }

  /**
   * handle file chooser input
   * @param files
   */
  public handleFileInput(files) {
    this.path = "../../../test_results/" + files.item(0).webkitRelativePath.split('/')[0] + '/';
    if (this.testsData !== undefined) {
      this.reset();
    }
    this.getTestApiData();
  }

  /**
   * input field for absolute path
   */
  public handlePathInput() {
    this.path = this.pathValue;
    if (this.testsData !== undefined) {
      this.showWelcomeScreen = true;
      this.reset();
    } else {
      this.showWelcomeScreen = false;
    }

    if (this.path) {
      this.showWelcomeScreen = false;
      this.getTestApiData();
    } else {
      this.showWelcomeScreen = true;
    }
  }

  public reset() {
    this.testsData = undefined;
    this.actionIds = [];
    this.actionId = undefined;
    this.sourceStateImg = undefined;
    this.resultingStateImg = undefined;
    this.widgets = [];
    this.status = undefined;
    this.interactedWidgetId = undefined;
    this.interactedWidgetData = undefined;
    this.loc = [];
    this.actionTestData = undefined;
    this.locMap = undefined;
    this.loader = false;
    this.timeLine.setTestsData(this.testsData, this.actionId);
    this.errorText = {};
    this.showWelcomeScreen = false;
  }

  /**
   * extracts the data content of the trace file
   */
  public getTestApiData() {
    this.apiService
      .getAllTestData(this.path)
      .subscribe(
        data => {
          this.handleData(data);
        },
        error => {
          this.handleError(error);
        }
      );
  }

  public handleData(data) {
    if (data) {
      this.errorText = {};
      this.pathValue = "";
      this.testsData = data;
      this.showWelcomeScreen = false;
      this.computeData(this.testsData);
      this.timeLine.setTestsData(this.testsData, this.actionId);
    } else {
      this.testsData = undefined;
      this.showWelcomeScreen = true;
    }
  }

  public handleError(error) {
    if (error && error.error) {
      this.errorText['message'] = error.error.message;
      this.errorText['type'] = "error";
      this.loader = false;
    }
  }

  /**
   * computes the data for the first actionId be default
   * @param data
   */
  public computeData(data) {
    this.testsData = data;
    if (this.testsData.length > 0) {
      this.testsData.forEach(item => {
        this.actionIds.push(item["Action-Id"]);
      });
      this.computeLoC(this.actionIds);
      this.setActionId(this.actionIds[0]);
    } else {
      console.log("No Data found");
    }

  }

  /**
   * computes the lines of code for all actions
   * @param actionIds
   */
  public computeLoC(actionIds) {
    this.apiService.getLoCDataForActionIds(actionIds.map(id => parseInt(id)), this.path)
      .subscribe(
        data => {
          this.locMap = new Map();
          Object.keys(data).forEach(key => {
            this.locMap.set(parseInt(key), data[key]);
          })
        },
        error => {
          this.handleError(error);
        }
      );
  }

  public setActionId(id) {
    this.actionId = parseInt(id);
    this.getDataForSelectedId();
  }

  /**
   * computes the widgets, the interacted widget and the images for an action
   */
  public getDataForSelectedId() {
    this.loader = true;

    this.apiService.getTestDataForActionId(this.actionId, this.path)
      .subscribe(
        data => {
          if (data) {
            if (data === {}) {
              this.handleError(new Error("Data of action " + this.actionId + "is undefined."));
            }
            this.actionTestData = data;
            this.computeDataForSelectedAction(this.actionTestData);
            this.loader = false;
          } else {
            this.loader = true;
          }
        },
        error => {
          this.handleError(error);
        }
      );
  }

  public getSafeImage(image) {
    return this.sanitizer.bypassSecurityTrustUrl("data:Image/*;base64," + image);
  }

  public computeDataForSelectedAction(data) {

    if (data) {
      if (data.widgets) {
        this.widgets = data.widgets;
      } else {
        this.widgets = [];
      }

      if (data.InteractedWidget && data.interactedWidgetData) {
        this.interactedWidgetId = data.InteractedWidget;
        this.interactedWidgetData = data.interactedWidgetData;
      } else {
        this.interactedWidgetId = "";
        this.interactedWidgetData = "";
      }

      if (this.locMap) {
        this.loc = this.locMap.get(this.actionId);
      } else {
        this.loc = [];
      }

      if (data.SuccessFul) {
        this.status = data.SuccessFul;
      }

      if (data["sourceStateImage"]) {
        this.sourceStateImg = data["sourceStateImage"];
      } else {
        this.sourceStateImg = '';
      }

      if (data["resultingStateImage"]) {
        this.resultingStateImg = data["resultingStateImage"];
      } else {
        this.resultingStateImg = '';
      }
    }
  }

  /**
   * checks if a line of code was covered by the LOC of a previous action respectively if the line of code is unique
   * @param item: line of code
   */
  public previousOccurrence(item) {
    let BreakException = {};
    let bool = false;
    if (item === []) {
      return false;
    }
    try {
      Array.from(this.locMap.keys()).filter(key => key < this.actionId)
        .forEach(key => {
          if (this.locMap.get(key).find(x => x === item)) {
            bool = true;
            throw BreakException;
          }
        });
    } catch (e) {
      if (e !== BreakException) throw e;
    }
    return bool;
  }

  public getClassForError(type) {
    if (type === 'error') {
      return 'error'
    } else if (type === 'warning') {
      return 'warning'
    } else if (type === 'info') {
      return 'info'
    } else {
      return '';
    }
  }

  public showFolderSelectBox(event) {
    this.showWelcomeScreen = true;
  }

  public hideFolderSelectBox(event) {
    this.showWelcomeScreen = false;
  }

}
