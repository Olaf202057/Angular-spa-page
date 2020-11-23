import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { filter, tap, takeUntil } from 'rxjs/operators';

import { StateService } from 'src/app/core/services';

@Component({
  selector: 'app-strategy-column-visibility',
  templateUrl: './strategy-column-visibility.component.html',
  styleUrls: ['./strategy-column-visibility.component.scss'],
})
export class StrategyColumnVisibilityComponent implements OnInit, OnDestroy {
  private _stop$: Subject<any>;

  selectedStrategy: any;
  mainColumns: any[];
  prevStatsColumns: any[];
  miscColumns: any[];

  constructor(private readonly _store: StateService) {
    this._setVariables();
  }

  ngOnInit(): void {
    this._getTargetStrategy();
  }

  ngOnDestroy(): void {
    this._stop$.next();
    this._stop$.complete();
  }

  private _setVariables(): void {
    this._stop$ = new Subject();

    this.selectedStrategy = {};

    this.mainColumns = [
      { label: 'Time', key: 'mainTime' },
      { label: 'Score', key: 'mainScore' },
      { label: 'Teams', key: 'mainTeams' },
      { label: 'Search', key: 'mainSearch' },
      { label: 'Corners', key: 'mainCorners' },
      // { label: 'Shots on target', key: 'mainTime' },
      // { label: 'Shots off target', key: 'mainTime' },
      { label: 'Possessions', key: 'mainPossession' },
      { label: 'Attacks', key: 'mainAttacks' },
      { label: 'Dangerous Attacks', key: 'mainDangerousAttacks' },
      { label: 'Yellow Cards', key: 'mainYellowCards' },
      // { label: 'Red Cards', key: 'mainTime' },
      // { label: 'AP1 graph', key: 'mainTime' },
      // { label: 'AP2 graph', key: 'mainTime' },
    ];
    this.prevStatsColumns = [
      { label: 'Shots on Target', key: 'previousSonT' },
      { label: 'Shots off Target', key: 'previousSoffT' },
      { label: 'Attacks', key: 'previousAttacks' },
      { label: 'Dangerous Attacks', key: 'previousDangerousAttacks' },
      { label: 'Corners', key: 'previousCorners' },
      { label: 'Goals', key: 'previousGoals' },
      { label: 'Intensity', key: 'previousIntensity' },
    ];
    this.miscColumns = [
      { label: 'Momentum', key: 'miscMomentum' },
      { label: 'Alerts', key: 'miscAlerts' },
      { label: 'Delete', key: 'miscDelete' },
    ];
  }

  private _getTargetStrategy(): void {
    this._store.targetStrategy
      .pipe(
        filter(Boolean),
        tap((strategy) => {
          this.selectedStrategy = strategy;
        }),
        takeUntil(this._stop$)
      )
      .subscribe(() => {});
  }

  onClickVisibility(item): void {
    this._store.setTargetStrategy({
      ...this.selectedStrategy,
      [item.key]: !this.selectedStrategy[item.key],
    });
  }
}
