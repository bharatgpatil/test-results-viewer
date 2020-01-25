import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {TimelineComponent} from './timeline.component';
import {By} from "@angular/platform-browser";
import {ElementRef, QueryList} from "@angular/core";

const mockSample7 = require("../../../../mockdata/json/data.js");
const mockData = require("../../../../mockdata/frontend/sample data/sample.json");
const mockTime = require("../../../../mockdata/frontend/timelineComputeTimeTest.json");
const mockDataMinutes = require("../../../../mockdata/frontend/timelineComputeWidthMinutesTest.json");
const mockDataSeconds = require("../../../../mockdata/frontend/timelineComputeWidthSecondsTest.json");

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;
  let eventSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    eventSpy = jasmine.createSpy('event');
    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('triggering click on button should call setActionIdEvent.emit', () => {
    component.setTestsData(mockData, '7');
    fixture.detectChanges();
    spyOn(component.setActionIdEvent, 'emit');
    let btn = fixture.debugElement.query(By.css('button#button_7'));
    btn.triggerEventHandler('click', '1');
    fixture.detectChanges();
    expect(component.setActionIdEvent.emit).toHaveBeenCalledWith(7);
  });

  it('sendActionId should call setActionIdEvent.emit one time', () => {
    let function_call = spyOn(component.setActionIdEvent, 'emit').and.callThrough();
    component.sendActionId(event, 1);
    expect(function_call).toHaveBeenCalledTimes(1);
  });

  it('computeTime(0) should return "1.100s" ', () => {
    component.testsData = mockTime;
    expect(component.computeTime(0)).toBe('1.100s');
  });

  it('computeTime(1) should return "1m:1.100s" ', () => {
    component.testsData = mockTime;
    expect(component.computeTime(1)).toBe('1m:1.100s');
  });

  it('computeTime(2) should return "1h:0m:1.100s" ', () => {
    component.testsData = mockTime;
    expect(component.computeTime(2)).toBe('1h:0m:1.100s');
  });

  it('computeTime(3) should return "1h:1m:1.100s" ', () => {
    component.testsData = mockTime;
    expect(component.computeTime(3)).toBe('1h:1m:1.100s');
  });

  it('computeTime(4) should return "24h:0m:1.100s" ', () => {
    component.testsData = mockTime;
    expect(component.computeTime(4)).toBe('24h:0m:1.100s');
  });

  it('computeTime(5) should return "24h:1m:1.100s" ', () => {
    component.testsData = mockTime;
    expect(component.computeTime(5)).toBe('24h:1m:1.100s');
  });

  it('computeTime(6) should return "25h:0m:1.100s" ', () => {
    component.testsData = mockTime;
    expect(component.computeTime(6)).toBe('25h:0m:1.100s');
  });

  it('computeTime(7) should return "25h:1m:1.100s" ', () => {
    component.testsData = mockTime;
    expect(component.computeTime(7)).toBe('25h:1m:1.100s');
  });

  it('computeTime(8) should return "1.010s" ', () => {
    component.testsData = mockTime;
    expect(component.computeTime(8)).toBe('1.010s');
  });

  it('computeTime(9) should return "1.001s" ', () => {
    component.testsData = mockTime;
    expect(component.computeTime(9)).toBe('1.001s');
  });

  it('computeWidthAndColor should return width and colour for hours', () => {
    component.testsData = mockTime;
    expect(component.computeWidthAndColor()).toEqual({
      'width': "80px",
      'background-color': "#1A237E",
      'height': '4px'
    });
  });

  it('computeWidthAndColor should return width and colour for minutes', () => {
    component.testsData = mockDataMinutes;
    expect(component.computeWidthAndColor()).toEqual({
      'width': "65px",
      'background-color': "#303F9F",
      'height': '3px'
    });
  });

  it('computeWidthAndColor should return width and colour for seconds', () => {
    component.testsData = mockDataSeconds;
    expect(component.computeWidthAndColor()).toEqual({
      'width': "50px",
      'background-color': "#5C6BC0",
      'height': '2px'
    });
  });

  it('getClassList should return "list-group-item circle item-selected-success-border list-item-success"', () => {
    component.selectedId = '7';
    expect(component.getClassList(mockSample7.mockdata.action_7)).toEqual('list-group-item circle item-selected item-selected-success-border list-item-success ');
  });

  it('getClassList should return "list-group-item circle list-item-success"', () => {
    component.selectedId = '4';
    expect(component.getClassList(mockSample7.mockdata.action_7)).toEqual('list-group-item circle list-item-success ');
  });

  it('getClassList should return "list-group-item circle item-selected-danger-border list-item-danger"', () => {
    component.selectedId = '9';
    expect(component.getClassList(mockSample7.mockdata.action_9)).toEqual('list-group-item circle item-selected item-selected-danger-border list-item-danger ');
  });

  it('getClassList should return "list-group-item circle list-item-danger"', () => {
    component.selectedId = '4';
    expect(component.getClassList(mockSample7.mockdata.action_9)).toEqual('list-group-item circle list-item-danger ');
  });
});
