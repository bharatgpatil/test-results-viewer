import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DashboardComponent} from './dashboard.component';
import {TimelineComponent} from "../../components/timeline/timeline.component";
import {FormsModule} from '@angular/forms';
import {Observable, of, throwError} from "rxjs";
import {ApiService} from "../../api.service";

const mockActionId = require("../../../../mockdata/frontend/sample data/7.json");
const mockData = require("../../../../mockdata/frontend/sample data/sample.json");
const mockMap = new Map();
mockMap.set(7, []);
mockMap.set(8, [1, 2, 3, 4, 5]);
mockMap.set(9, [2, 3, 5, 6, 7]);
mockMap.set(10, [8, 9, 10, 11, 12]);
mockMap.set(11, []);
const mockMapObject = {};
mockMapObject[7] = [];
mockMapObject[8] = [1, 2, 3, 4, 5];
mockMapObject[9] = [2, 3, 5, 6, 7];
mockMapObject[10] = [8, 9, 10, 11, 12];
mockMapObject[11] = [];
const actionIds = [7, 8, 9, 10, 11];

describe('DashboardComponent', () => {
  class MockApiService {

    getTestDataForActionId(id, path) {
      return of(mockActionId);

    }

    getAllTestData(path) {
      return of(mockData);
    }

    getLoCDataForActionIds(ids, path) {
      return of(mockMapObject);
    }
  }

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let service: MockApiService;

  beforeEach(async(() => {
      service = new MockApiService();
      TestBed
        .configureTestingModule({
          declarations: [DashboardComponent, TimelineComponent],
          imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
          providers: [
            {provide: ApiService, useValue: service}
          ]
        })
        .compileComponents();
    }
  ))
  ;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('previousOccurrence([]) for this.actionId = 7 should output false', function () {
    component.actionId = 7;
    component.locMap = mockMap;
    expect(component.previousOccurrence([])).toBe(false);
  });

  it('previousOccurrence(1) and previousOccurrence(5) for this.actionId = 8 should output false', function () {
    component.actionId = 8;
    component.locMap = mockMap;
    expect(component.previousOccurrence(1)).toBe(false);
    expect(component.previousOccurrence(5)).toBe(false);
  });

  it('previousOccurrence(2) and previousOccurrence(3) and previousOccurrence(5) for this.actionId = 9 should output true', function () {
    component.actionId = 9;
    component.locMap = mockMap;
    expect(component.previousOccurrence(2)).toBe(true);
    expect(component.previousOccurrence(3)).toBe(true);
    expect(component.previousOccurrence(5)).toBe(true);
  });

  it('previousOccurrence(6) and previousOccurrence(7) for this.actionId = 9 should output false', function () {
    component.actionId = 9;
    component.locMap = mockMap;
    expect(component.previousOccurrence(6)).toBe(false);
    expect(component.previousOccurrence(7)).toBe(false);
  });

  it('previousOccurrence(8) and previousOccurrence(12) for this.actionId = 10 should output false', function () {
    component.actionId = 10;
    component.locMap = mockMap;
    expect(component.previousOccurrence(8)).toBe(false);
    expect(component.previousOccurrence(12)).toBe(false);
  });

  it('previousOccurrence([]) for this.actionId = 11 should output false', function () {
    component.actionId = 11;
    component.locMap = mockMap;
    expect(component.previousOccurrence([])).toBe(false);
  });

  it('getClassForError should return empty string', function () {
    expect(component.getClassForError("test")).toBe('');
  });

  it('getClassForError should return "error', function () {
    expect(component.getClassForError('error')).toBe('error');
  });

  it('getClassForError should return "warning', function () {
    expect(component.getClassForError('warning')).toBe('warning');
  });

  it('getClassForError should return "info', function () {
    expect(component.getClassForError('info')).toBe('info');
  });

  it('showWelcomeMessage should set welcome screen to false for defined testsData', () => {
    component.testsData = mockData;
    component.showWelcomeMessage();
    expect(component.showWelcomeScreen).toEqual(false);
    expect(component.errorText).toEqual({});
  });

  it('showWelcomeMessage should set welcome screen to true for undefined testsData', () => {
    component.testsData = undefined;
    component.showWelcomeMessage();
    expect(component.showWelcomeScreen).toEqual(true);
    expect(component.errorText["message"]).toEqual('Please select a directory or enter directory path in the input field to visualize the test results.');
    expect(component.errorText["type"]).toEqual('info');
  });

  it('handlePathInput() should call reset() for defined testsData with undefined path', () => {
    let function_call = spyOn(component, "reset").and.callThrough();
    component.pathValue = undefined;
    component.testsData = mockData;
    component.handlePathInput();
    expect(function_call).toHaveBeenCalledTimes(1);
    expect(component.showWelcomeScreen).toEqual(true);
  });

  

  it('handlePathInput() should call reset() and getTestApiData() for defined testsData with defined path', () => {
    let function_call = spyOn(component, "reset").and.callThrough();
    let function_call_api = spyOn(component, "getTestApiData").and.callThrough();
    component.pathValue = "path";
    component.testsData = mockData;
    component.handlePathInput();
    expect(function_call).toHaveBeenCalledTimes(1);
    expect(function_call_api).toHaveBeenCalledTimes(1);
    expect(component.showWelcomeScreen).toEqual(false);
  });


  it('handlePathInput() should call getTestApiData() for undefined testsData with defined path', () => {
    let function_call = spyOn(component, "reset").and.callThrough();
    let function_call_api = spyOn(component, "getTestApiData").and.callThrough();
    component.pathValue = "path";
    component.testsData = undefined;
    component.handlePathInput();
    expect(function_call).toHaveBeenCalledTimes(0);
    expect(function_call_api).toHaveBeenCalledTimes(1);
    expect(component.showWelcomeScreen).toEqual(false);
  });

    
  it('handlePathInput() should set showWelcomeScreen to true for undefined testsData with undefined path', () => {
    let function_call_api = spyOn(component, "getTestApiData").and.callThrough();
    component.pathValue = undefined;
    component.testsData = undefined;
    component.handlePathInput();
    expect(function_call_api).toHaveBeenCalledTimes(0);
    expect(component.showWelcomeScreen).toEqual(true);
  });

  it('handleData should set testsData for undefined data', () => {
    component.handleData(undefined);
    expect(component.testsData).toBe(undefined);
    expect(component.showWelcomeScreen).toEqual(true);
  });

  it('computeLoC should compute locMap', () => {
    component.path = "path";
    component.computeLoC(actionIds);
    expect(component.locMap).toEqual(mockMap);
  });

  it('computeLoC should catch error', () => {
    component.path = "path";
    let function_call = spyOn(component, "handleError").and.callThrough();
    spyOn(service, 'getLoCDataForActionIds').and.callFake(() => {
      return throwError(new Error('Fake error'));});
    component.computeLoC(actionIds);
    expect(function_call).toHaveBeenCalledTimes(1);
  });
});
