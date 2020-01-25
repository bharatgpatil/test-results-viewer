
import { TestBed, async, inject } from '@angular/core/testing';
import {
  HttpModule,
  Http,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

const mockData = require("../../mockdata/frontend/sample data/sample.json");
const mockActionId = require("../../mockdata/frontend/sample data/7.json");

describe('ApiService', () => {

  beforeEach(() => {

    let API_URL = 'http://localhost:4400';

    TestBed.configureTestingModule({
      imports: [HttpModule, HttpClientTestingModule],
      providers: [
        { provide: API_URL, useValue: 'http://example.com' },
        ApiService,
        { provide: XHRBackend, useClass: MockBackend },
      ]
    });
  });

  describe('getTestsData()', () => {

    it('should return an TestsData',
        inject([ApiService, XHRBackend], (apiService, mockBackend) => {

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockData)
          })));
        });

        apiService.getAllTestData('c://data').subscribe((data) => {
          expect(data.length).toBe(31);
        });

    }));


    it('should return an ActionData',
        inject([ApiService, XHRBackend], (apiService, mockBackend) => {


        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockActionId)
          })));
        });

        apiService.getTestDataForActionId(7, 'c://data').subscribe((data) => {
          expect(data.length).toBe(1);
          expect(data['Action-Id']).toEqual('7');

        });

    }));

    it('should return an LocData',
        inject([ApiService, XHRBackend], (apiService, mockBackend) => {

          const mockMap = new Map();
          mockMap.set(7, []);
          mockMap.set(8, [1, 2, 3, 4, 5]);

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockMap)
          })));
        });

        apiService.getLoCDataForActionIds([7, 8], 'c://data').subscribe((data) => {
          expect(data.length).toBe(1);
        });

    }));

  });
});