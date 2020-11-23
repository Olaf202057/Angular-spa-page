import { Injectable } from '@angular/core';
import { merge } from 'jquery';

import { map, tap, mergeMap } from 'rxjs/operators';

import { ApiService } from './api.service';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root',
})
export class PlannerService {
  constructor(
    private readonly _api: ApiService,
    private readonly _store: StateService
  ) {}

  getUpcomingMatches() {
    return this._api.get('/upcomingmatches').pipe(
      map((res) => res.body),
      tap(({ matches: { upcomingMatches, teamImages } }) => {
        this._store.setTeamImages(teamImages);
        this._store.setUpcomingMatches(upcomingMatches);
      })
    );
  }

  createNote(note) {
    return this._api.post('/notes', note).pipe(mergeMap(() => this.getNotes()));
  }

  getNotes() {
    return this._api.get('/notes').pipe(
      map((res) => res.body),
      tap(({ notes: { notes } }) => {
        this._store.setNotes(notes);
      })
    );
  }

  createPrediction(prediction) {
    return this._api
      .post('/predictions', prediction)
      .pipe(mergeMap(() => this.getPredictions()));
  }

  getPredictions() {
    return this._api.get('/predictions').pipe(
      map((res) => res.body),
      tap(({ predictions: { predictions } }) => {
        this._store.setPredictions(predictions);
      })
    );
  }

  deletePrediction(predictionId) {
    return this._api
      .delete(`/predictions?predictionId=${predictionId}`)
      .pipe(mergeMap(() => this.getPredictions()));
  }

  getStrategies() {
    return this._api.get('/strategies').pipe(
      map((res) => res.body),
      tap(({ strategies: { strategies } }) => {
        this._store.setStrategies(strategies);
      })
    );
  }

  getStrategyMatches() {
    return this._api.get('/strategymatches').pipe(
      map((res) => res.body),
      tap(({ strategyMatches: { strategyMatches } }) => {
        this._store.setStrategyMatches(strategyMatches);
      })
    )
  }

  saveStrategy(strategy) {
    return this._api.post('/strategies', strategy).pipe(map((res) => res.body));
  }

  deleteStrategy(strategyId) {
    return this._api
      .delete(`/strategies?strategyId=${strategyId}`)
      .pipe(mergeMap(() => this.getStrategies()));
  }

  addStrategyMatch(strategyMatch) {
    return this._api
      .post('/strategymatches', strategyMatch)
      .pipe(
        mergeMap(() => this.getStrategyMatches())
      );
  }
  deleteStrategyMatch(strategyMatchId) {
    return this._api
      .delete(`/strategymatches?strategyMatchId=${strategyMatchId}`)
      .pipe(
        mergeMap(() => this.getStrategyMatches())
      );
  }
}
