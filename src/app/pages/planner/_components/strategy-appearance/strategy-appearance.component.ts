import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { StateService } from 'src/app/core/services';

@Component({
  selector: 'app-strategy-appearance',
  templateUrl: './strategy-appearance.component.html',
  styleUrls: ['./strategy-appearance.component.scss'],
})
export class StrategyAppearanceComponent implements OnInit, OnDestroy {
  private _stop$: Subject<any>;

  targetStrategy: any;
  strategyName: string;
  strategyColor: string;
  disableQuickFilters: boolean;
  showOnScanner: boolean;
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
    this.strategyName = null;
    this.strategyColor = null;
    this.disableQuickFilters = false;
  }

  private _getTargetStrategy(): void {
    this._store.targetStrategy
      .pipe(
        filter(Boolean),
        tap((strategy) => {
          this.targetStrategy = strategy;

          this.strategyName = this.targetStrategy.name || '';
          this.strategyColor = this.targetStrategy.colour || '';
          this.disableQuickFilters =
            this.targetStrategy.disableQuickFilters || false;
          this.showOnScanner = 
            this.targetStrategy.showOnScanner || false;
        })
      )
      .subscribe(() => {});
  }

  onChangeName(event): void {
    this.strategyName = event.target.value;
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      name: this.strategyName,
    });
  }

  onChangeColor(event): void {
    this.strategyColor = event.target.value;
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      colour: this.strategyName,
    });
  }

  onChangeDisableStatus(event): void {
    this.disableQuickFilters = event.target.checked;
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      disableQuickFilters: this.disableQuickFilters,
    });
  }
  onChangeShowOnScannerStatus(event): void {
    this.showOnScanner = event.target.checked;
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      showOnScanner: this.showOnScanner,
    });
  }
}
