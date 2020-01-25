import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  uri = 'http://localhost:4400';

  constructor(private http: HttpClient) { }

  getAllTestData(path) {
    const obj = {
      path: path
    };
    return this.http.post(`${this.uri}/getTestsData`, obj);
  }

  getTestDataForActionId(id,path) {
    const obj = {
      path: path
    };
    return this.http.post(`${this.uri}/getActionDataForId/${id}`, obj);
  }

  getLoCDataForActionIds(ids,path) {
    const obj = {
      path: path,
      ids: ids
    };
    return this.http.post(`${this.uri}/getLoCDataForIds`, obj);
  }
}
