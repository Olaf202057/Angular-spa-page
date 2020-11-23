import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ENDPOINTS} from './endpoints'
import {map} from "rxjs/operators"
import * as moment from 'moment'; // add this 1 of 4

@Injectable({
  providedIn: 'root'
})
export class PlayService {

  constructor(private http: HttpClient) { }

  getPlayResults(){
    return this.http.get(ENDPOINTS.GET_ALL_PLAY_URL).pipe(
      map((data)=>{
        data['kickOffTime'] = moment(data['kickOffTime']);
        return data;
      })
    )
  }

  getPredictionsManagerResults(){
    return this.http.get(ENDPOINTS.GET_PREDICTION_PLAY_URL).pipe(
      map((data)=>{
        data['kickOffTime'] = moment(data['kickOffTime']);
        return data;
      })
    )
  }

  getStrategyResults() {
    return this.http.get(ENDPOINTS.GET_STRATEGY).pipe(
      map((data)=>{
        return data['strategies'].strategies;
      })
    )
  }

  getHistoricalMatches(data){
    let httpParams = new HttpParams();
    
    httpParams = data.homeId ? httpParams.append('homeId',data.homeId) : httpParams;
    httpParams = data.awayId ? httpParams.append('awayId',data.awayId) : httpParams;
    return this.http.get(ENDPOINTS.GET_HISTORICAL_MATCHES_URL,{params:httpParams}).pipe(
      map((data)=>{
        data['kickOffTime'] = moment(data['kickOffTime']).toDate();
        return data;
      })
    )

  }
}
