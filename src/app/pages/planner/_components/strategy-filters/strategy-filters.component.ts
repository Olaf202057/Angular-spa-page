import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { filter, tap, takeUntil } from 'rxjs/operators';

import { StateService } from 'src/app/core/services';

@Component({
  selector: 'app-strategy-filters',
  templateUrl: './strategy-filters.component.html',
  styleUrls: ['./strategy-filters.component.scss'],
})
export class StrategyFiltersComponent implements OnInit, OnDestroy {
  private _stop$: Subject<any>;

  strategy: any;

  filters: string[];
  statTypes: string[];
  filterTypes: string[];

  statType: any;
  statFilterType: any;
  statFilterValue: any;

  goalsArr: number[];
  homeGoals: any;
  awayGoals: any;

  constructor(private readonly _store: StateService) {
    this._setVariables();
  }

  ngOnInit(): void {
    this._getTargetStrategy();
    console.log("strage", this.statFilterType);
  }

  ngOnDestroy(): void {
    this._stop$.next();
    this._stop$.complete();
  }

  private _setVariables(): void {
    this._stop$ = new Subject();
    this.statTypes = [
      'Home Shots on Target',
      'Home Shots off Target',
      'Home Attacks',
      'Home Dangerous Attacks',
      'Home Corners',
      'Home Possession',
      'Home Yellow Cards',
      'Home Red Cards',
      'Home Goals',
      'Away Shots on Target',
      'Away Shots off Target',
      'Away Attacks',
      'Away Dangerous Attacks',
      'Away Corners',
      'Away Possession',
      'Away Yellow Cards',
      'Away Red Cards',
      'Away Goals',
      'Total Shots on Target',
      'Total Shots off Target',
      'Total Attacks',
      'Total Dangerous Attacks',
      'Total Corners',
      'Total Possession',
      'Total Yellow Cards',
      'Total Red Cards',
      'Total Goals',
    ];
    this.filterTypes = ['>', '<', '='];

    this.statType = '';
    this.statFilterType = '';
    this.statFilterValue = '';

    this.goalsArr = new Array(10).fill(1);
    this.homeGoals = 0;
    this.awayGoals = 0;
  }

  private _getTargetStrategy(): void {
    this._store.targetStrategy
      .pipe(
        filter(Boolean),
        tap(this._setTargetStrategy.bind(this)),
        takeUntil(this._stop$)
      )
      .subscribe(() => {});
  }

  private _setTargetStrategy(strategy): void {
    this.strategy = strategy;
    const { correctScoreFiltersList, statsFiltersList } = this.strategy;
    const correctScoreFilters = (correctScoreFiltersList || []).map(
      ({ homeGoals, awayGoals }) => `${homeGoals} - ${awayGoals}`
    );
    const statFilters = (
      statsFiltersList || []
    ).map(({ statType, operator, value }) =>
      [statType, operator, value].join(' ')
    );
    this.filters = [...statFilters, ...correctScoreFilters];
  }

  onClickFilter(selectedFilter): void {
    this.filters = [...this.filters].filter((el) => el !== selectedFilter);
  }

  onChangeStatType(event): void {
    this.statType = event.target.value;
  }

  onChangeStatFilterType(event): void {
    this.statFilterType = event.target.value;
  }

  onChangeStatFilterValue(event): void {
    this.statFilterValue = event.target.value;
  }

  onAddStatFilter(): void {
    if (!this.statType || !this.statFilterType || !this.statFilterValue) {
      return;
    }

    if (
      this.statType === 'Stat Type' ||
      this.statFilterType === 'Filter Type'
    ) {
      return;
    }

    if (Number.isNaN(Number(this.statFilterValue))) {
      return;
    }

    const newItem = `${this.statType} ${this.statFilterType} ${this.statFilterValue}`;
    if ([...(this.filters || [])].some((el) => el === newItem)) {
      return;
    }

    this.filters = [
      ...(this.filters || []),
      `${this.statType} ${this.statFilterType} ${this.statFilterValue}`,
    ];

    const newStrategyFiltersList = [
      ...(this.strategy.statsFiltersList || []),
      {
        statType: this.statType,
        operator: this.statFilterType,
        value: Number(this.statFilterValue),
      },
    ];

    this._store.setTargetStrategy({
      ...this.strategy,
      statsFiltersList: newStrategyFiltersList,
    });
  }

  onChangeHomeGoals(event): void {
    this.homeGoals = Number(event.target.value);
  }

  onChangeAwayGoals(event): void {
    this.awayGoals = Number(event.target.value);
  }

  onAddCorrectScoreFilter(): void {
    const newItem = `${this.homeGoals} - ${this.awayGoals}`;
    if ([...(this.filters || [])].some((el) => el === newItem)) {
      return;
    }

    this.filters = [
      ...(this.filters || []),
      `${this.homeGoals} - ${this.awayGoals}`,
    ];
    this._store.setTargetStrategy({
      ...this.strategy,
      correctScoreFiltersList: [
        ...(this.strategy.correctScoreFiltersList || []),
        { homeGoals: this.homeGoals, awayGoals: this.awayGoals },
      ],
    });
  }
}
