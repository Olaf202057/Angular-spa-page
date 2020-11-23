import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import {
  filter,
  tap,
  takeUntil,
  mergeMap,
  take,
  finalize,
} from 'rxjs/operators';
import { Subject } from 'rxjs';

import { StateService, PlannerService } from 'src/app/core/services';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-strategy-list',
  templateUrl: './strategy-list.component.html',
  styleUrls: ['./strategy-list.component.scss'],
})
export class StrategyListComponent implements OnInit, OnDestroy {
  private _stop$: Subject<any>;

  strategies: any[];
  selectedStrategy: any;

  isSavingStrategy: boolean;

  constructor(
    public dialog: MatDialog,
    private readonly _cdRef: ChangeDetectorRef,
    private readonly _store: StateService,
    private readonly _plannerService: PlannerService
  ) {
    this._setVariables();
  }

  ngOnInit(): void {
    this._getStrategies();
  }

  ngOnDestroy(): void {
    this._stop$.next();
    this._stop$.complete();
  }

  private _setVariables(): void {
    this._stop$ = new Subject();
    this.selectedStrategy = Object.create(null);
    this.isSavingStrategy = false;
  }

  private _getStrategies(): void {
    this._store.strategies
      .pipe(
        filter(Boolean),
        tap((strategies: any) => {
          this.strategies = strategies;

          if (this.strategies.length > 0 && !this.isSavingStrategy) {
            this.selectedStrategy = this.strategies[0];
            this._store.setTargetStrategy(this.selectedStrategy);
          }

          if (this.isSavingStrategy) {
            this.isSavingStrategy = false;
          }

          this._cdRef.detectChanges();
        }),
        takeUntil(this._stop$)
      )
      .subscribe(() => {});
  }

  onChangeTargetStrategy(strategy): void {
    this.selectedStrategy = strategy;
    this._store.setTargetStrategy(this.selectedStrategy);
    this._cdRef.detectChanges();
  }

  onCreateStrategy(): void {
    const strategy = Object.entries(this.selectedStrategy).reduce(
      (acc, cur) => {
        const [key, value] = cur;

        if (key === 'strategyId' || key === 'userId') {
          return { ...acc };
        }

        if (key === 'statsFiltersList' || key === 'correctScoreFiltersList') {
          return { ...acc, [key]: [] };
        }

        if (typeof value === 'boolean') {
          return { ...acc, [key]: true };
        }

        if (typeof value === 'string') {
          return { ...acc, [key]: '' };
        }

        if ([undefined, null].includes(value)) {
          return { ...acc, [key]: '' };
        }
      },
      {}
    );

    this.selectedStrategy = strategy;
    this._store.setTargetStrategy(strategy);
  }

  onSaveStrategy() {
    this.isSavingStrategy = true;
    this._store.targetStrategy
      .pipe(
        take(1),
        mergeMap((strategy) => this._plannerService.saveStrategy(strategy)),
        tap(async ({ strategyId }) => {
          const {
            strategies: { strategies },
          } = await this._plannerService.getStrategies().toPromise();

          const savedStrategy = strategies.find(
            (el) => el.strategyId === strategyId
          );
          this.selectedStrategy = savedStrategy;
          this._store.setTargetStrategy(savedStrategy);
        }),
        finalize(() => {
          this._cdRef.detectChanges();
        })
      )
      .subscribe(() => {});
  }

  onDeleteStrategy(strategy) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.height = '176px';
    dialogConfig.position = { top: '32px' };
    dialogConfig.data = {
      msg: `Are you sure you want to delete strategy ${strategy.name}?`,
      operation: 'delete',
    };
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'confirm-dialog';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        mergeMap(() =>
          this._plannerService.deleteStrategy(strategy.strategyId)
        ),
        mergeMap(() => this._plannerService.getStrategies()),
        finalize(() => {
          this._cdRef.detectChanges();
        })
      )
      .subscribe(() => {});
  }

  isActiveStrategy(strategy): boolean {
    return this.selectedStrategy.strategyId === strategy.strategyId;
  }
}
