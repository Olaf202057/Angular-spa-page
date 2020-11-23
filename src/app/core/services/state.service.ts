import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _notes$: BehaviorSubject<any> = new BehaviorSubject(null);
  notes = this._notes$.asObservable();

  private _predictions$: BehaviorSubject<any> = new BehaviorSubject(null);
  predictions = this._predictions$.asObservable();

  private _strategies$: BehaviorSubject<any> = new BehaviorSubject(null);
  strategies = this._strategies$.asObservable();

  private _upcomingMatches$: BehaviorSubject<any> = new BehaviorSubject(null);
  upcomingMatches = this._upcomingMatches$.asObservable();

  private _teamImages$: BehaviorSubject<any> = new BehaviorSubject(null);
  teamImages = this._teamImages$.asObservable();

  private _targetMatch$: BehaviorSubject<any> = new BehaviorSubject(null);
  targetMatch = this._targetMatch$.asObservable();

  private _targetPrediction$: BehaviorSubject<any> = new BehaviorSubject(null);
  targetPrediction = this._targetPrediction$.asObservable();

  private _targetStrategy$: BehaviorSubject<any> = new BehaviorSubject(null);
  targetStrategy = this._targetStrategy$.asObservable();

  private _strategyMatches$: BehaviorSubject<any> = new BehaviorSubject(null);
  strategyMatches = this._strategyMatches$.asObservable();

  constructor() {}

  setNotes(notes) {
    this._notes$.next(notes);
  }

  setPredictions(predictions) {
    this._predictions$.next(predictions);
  }

  setStrategies(strategies) {
    this._strategies$.next(strategies);
  }

  setUpcomingMatches(matches) {
    this._upcomingMatches$.next(matches);
  }

  setTeamImages(teamImages) {
    this._teamImages$.next(teamImages);
  }

  setTargetMatch(match) {
    this._targetMatch$.next(match);
  }

  setTargetPrediction(prediction): void {
    this._targetPrediction$.next(prediction);
  }

  setTargetStrategy(strategy): void {
    this._targetStrategy$.next(strategy);
  }

  setStrategyMatches(strategyMatches): void {
    this._strategyMatches$.next(strategyMatches);
  }
}
