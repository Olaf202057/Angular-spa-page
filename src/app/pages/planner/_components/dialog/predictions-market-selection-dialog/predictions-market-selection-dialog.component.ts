import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { Subject, combineLatest } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { PlannerService, StateService } from 'src/app/core/services';
import { PredictionResultPipe } from '../../../_core';

declare const $: any;

// tslint:disable-next-line: variable-name
const getMarketSelections = (homeTeam, awayTeam) => [
  {
    market: 'Result',
    options: [
      { values: ['Match', '1st Half', '2nd Half', '10 minute'] },
      { values: [homeTeam, 'Draw', awayTeam] },
    ],
  },
  {
    market: 'Double Chance',
    options: [
      { values: ['Match'] },
      {
        values: [
          `${homeTeam} or Draw`,
          `Draw or ${awayTeam}`,
          `${homeTeam} or ${awayTeam}`,
        ],
      },
    ],
  },
  {
    market: 'Total Goals',
    options: [
      { values: ['Over', 'Exactly', 'Under'] },
      {
        values: [
          '0 Goals',
          '1 Goals',
          '2 Goals',
          '3 Goals',
          '4 Goals',
          '5 Goals',
          '6 Goals',
          '7 Goals',
          '8 Goals',
          '9 Goals',
          '10 Goals',
          '11 Goals',
        ],
      },
      { values: ['Match', '1st Half', '2nd Half', 'First 10 minute'] },
      { values: ['Both Teams Combined', homeTeam, awayTeam] },
    ],
  },
  {
    market: 'Corners',
    options: [
      { values: ['Over', 'Exactly', 'Under'] },
      {
        values: [
          '0 Corners',
          '1 Corners',
          '2 Corners',
          '3 Corners',
          '4 Corners',
          '5 Corners',
          '6 Corners',
          '7 Corners',
          '8 Corners',
          '9 Corners',
          '10 Corners',
          '11 Corners',
          '12 Corners',
          '13 Corners',
          '14 Corners',
          '15 Corners',
          '16 Corners',
          '17 Corners',
          '18 Corners',
          '19 Corners',
        ],
      },
      { values: ['Match', '1st Half', '2nd Half', 'First 10 minute'] },
      { values: ['Both Teams Combined', homeTeam, awayTeam] },
    ],
  },
  {
    market: 'Both Teams on Score',
    options: [
      { values: ['Match', '1st Half', '2nd Half'] },
      { values: ['Yes', 'No'] },
    ],
  },
  {
    market: 'Half Time/Full Time',
    options: [
      { values: ['Half Time', 'Full Time'] },
      { values: [homeTeam, 'Draw', awayTeam] },
    ],
  },
  {
    market: 'Score',
    options: [
      { values: ['Full Time Score', 'Half Time Score'] },
      {
        values: [
          `${homeTeam} 1-0`,
          `${homeTeam} 2-0`,
          `${homeTeam} 2-1`,
          `${homeTeam} 3-0`,
          `${homeTeam} 3-1`,
          `${homeTeam} 3-2`,
          `${homeTeam} 4-0`,
          `${homeTeam} 4-1`,
          `${homeTeam} 4-2`,
          `${homeTeam} 4-3`,
          `${homeTeam} 5-0`,
          `${homeTeam} 5-1`,
          `${homeTeam} 5-2`,
          `${homeTeam} 5-3`,
          `${homeTeam} 5-4`,
          `Draw 0-0`,
          `Draw 1-1`,
          `Draw 2-2`,
          `Draw 3-3`,
          `Draw 4-4`,
          `Draw 5-5`,
          `${awayTeam} 1-0`,
          `${awayTeam} 2-0`,
          `${awayTeam} 2-1`,
          `${awayTeam} 3-0`,
          `${awayTeam} 3-1`,
          `${awayTeam} 3-2`,
          `${awayTeam} 4-0`,
          `${awayTeam} 4-1`,
          `${awayTeam} 4-2`,
          `${awayTeam} 4-3`,
          `${awayTeam} 5-0`,
          `${awayTeam} 5-1`,
          `${awayTeam} 5-2`,
          `${awayTeam} 5-3`,
          `${awayTeam} 5-4`,
        ],
      },
    ],
  },
  {
    market: 'Half with Most Goals',
    options: [{ values: ['1st Half', '2nd Half', 'Neither Half(Tie)'] }],
  },
  {
    market: 'Yellow Cards',
    options: [
      { values: ['Over', 'Exactly', 'Under'] },
      {
        values: [
          '0 Cards',
          '1 Cards',
          '2 Cards',
          '3 Cards',
          '4 Cards',
          '5 Cards',
          '6 Cards',
          '7 Cards',
          '8 Cards',
          '9 Cards',
          '10 Cards',
          '11 Cards',
          '12 Cards',
        ],
      },
      { values: ['Match', '1st Half', '2nd Half', 'First 10 minute'] },
      { values: ['Both Teams Combined', homeTeam, awayTeam] },
    ],
  },
  {
    market: 'Red Cards',
    options: [
      { values: ['Over', 'Exactly', 'Under'] },
      {
        values: [
          '0 Cards',
          '1 Cards',
          '2 Cards',
          '3 Cards',
          '4 Cards',
          '5 Cards',
          '6 Cards',
          '7 Cards',
          '8 Cards',
          '9 Cards',
          '10 Cards',
          '11 Cards',
          '12 Cards',
        ],
      },
      { values: ['Match', '1st Half', '2nd Half', 'First 10 minute'] },
      { values: ['Both Teams Combined', homeTeam, awayTeam] },
    ],
  },
  {
    market: 'Goal Times',
    options: [
      { values: ['Goal', 'No Goal'] },
      {
        values: [
          '0 - 5 minutes',
          '5 - 10 minutes',
          '10 - 15 minutes',
          '15 - 20 minutes',
          '20 - 25 minutes',
          '25 - 30 minutes',
          '30 - 35 minutes',
          '35 - 40 minutes',
          '40 - 45 minutes',
          '45 - 50 minutes',
          '50 - 55 minutes',
          '55 - 60 minutes',
          '60 - 65 minutes',
          '65 - 70 minutes',
          '70 - 75 minutes',
          '75 - 80 minutes',
          '80 - 85 minutes',
          '85 - 90 minutes',
        ],
      },
    ],
  },
  {
    market: 'Total Cards',
    options: [
      { values: ['Over', 'Exactly', 'Under'] },
      {
        values: [
          '0 Cards',
          '1 Cards',
          '2 Cards',
          '3 Cards',
          '4 Cards',
          '5 Cards',
          '6 Cards',
          '7 Cards',
          '8 Cards',
          '9 Cards',
          '10 Cards',
          '11 Cards',
          '12 Cards',
        ],
      },
      { values: ['Match', '1st Half', '2nd Half', 'First 10 minute'] },
      { values: ['Both Teams Combined', homeTeam, awayTeam] },
    ],
  },
  {
    market: 'Free Kicks',
    options: [
      { values: ['Over', 'Exactly', 'Under'] },
      {
        values: [
          '0.5 Free Kicks',
          '1.5 Free Kicks',
          '2.5 Free Kicks',
          '3.5 Free Kicks',
          '4.5 Free Kicks',
          '5.5 Free Kicks',
          '6.5 Free Kicks',
          '7.5 Free Kicks',
          '8.5 Free Kicks',
          '9.5 Free Kicks',
          '10.5 Free Kicks',
          '11.5 Free Kicks',
          '12.5 Free Kicks',
          '13.5 Free Kicks',
          '14.5 Free Kicks',
          '15.5 Free Kicks',
          '16.5 Free Kicks',
          '17.5 Free Kicks',
          '18.5 Free Kicks',
          '19.5 Free Kicks',
          '20.5 Free Kicks',
          '21.5 Free Kicks',
          '22.5 Free Kicks',
          '23.5 Free Kicks',
          '24.5 Free Kicks',
          '25.5 Free Kicks',
          '26.5 Free Kicks',
          '27.5 Free Kicks',
          '28.5 Free Kicks',
          '29.5 Free Kicks',
          '30.5 Free Kicks',
          '31.5 Free Kicks',
          '32.5 Free Kicks',
          '33.5 Free Kicks',
          '34.5 Free Kicks',
          '35.5 Free Kicks',
          '36.5 Free Kicks',
          '37.5 Free Kicks',
          '38.5 Free Kicks',
          '39.5 Free Kicks',
          '40.5 Free Kicks',
          '41.5 Free Kicks',
          '42.5 Free Kicks',
          '43.5 Free Kicks',
          '44.5 Free Kicks',
          '45.5 Free Kicks',
          '46.5 Free Kicks',
          '47.5 Free Kicks',
          '48.5 Free Kicks',
          '49.5 Free Kicks',
        ],
      },
      { values: ['Match', '1st Half', '2nd Half', 'First 10 minute'] },
      { values: ['Both Teams Combined', homeTeam, awayTeam] },
    ],
  },
  {
    market: 'Throw Ins',
    options: [
      { values: ['Over', 'Exactly', 'Under'] },
      {
        values: [
          '0.5 Throw Ins',
          '1.5 Throw Ins',
          '2.5 Throw Ins',
          '3.5 Throw Ins',
          '4.5 Throw Ins',
          '5.5 Throw Ins',
          '6.5 Throw Ins',
          '7.5 Throw Ins',
          '8.5 Throw Ins',
          '9.5 Throw Ins',
          '10.5 Throw Ins',
          '11.5 Throw Ins',
          '12.5 Throw Ins',
          '13.5 Throw Ins',
          '14.5 Throw Ins',
          '15.5 Throw Ins',
          '16.5 Throw Ins',
          '17.5 Throw Ins',
          '18.5 Throw Ins',
          '19.5 Throw Ins',
          '20.5 Throw Ins',
          '21.5 Throw Ins',
          '22.5 Throw Ins',
          '23.5 Throw Ins',
          '24.5 Throw Ins',
          '25.5 Throw Ins',
          '26.5 Throw Ins',
          '27.5 Throw Ins',
          '28.5 Throw Ins',
          '29.5 Throw Ins',
          '30.5 Throw Ins',
          '31.5 Throw Ins',
          '32.5 Throw Ins',
          '33.5 Throw Ins',
          '34.5 Throw Ins',
          '35.5 Throw Ins',
          '36.5 Throw Ins',
          '37.5 Throw Ins',
          '38.5 Throw Ins',
          '39.5 Throw Ins',
          '40.5 Throw Ins',
          '41.5 Throw Ins',
          '42.5 Throw Ins',
          '43.5 Throw Ins',
          '44.5 Throw Ins',
          '45.5 Throw Ins',
          '46.5 Throw Ins',
          '47.5 Throw Ins',
          '48.5 Throw Ins',
          '49.5 Throw Ins',
        ],
      },
      { values: ['Match', '1st Half', '2nd Half', 'First 10 minute'] },
      { values: ['Both Teams Combined', homeTeam, awayTeam] },
    ],
  },
  {
    market: 'Goal Kicks',
    options: [
      { values: ['Over', 'Exactly', 'Under'] },
      {
        values: [
          '0.5 Goal Kicks',
          '1.5 Goal Kicks',
          '2.5 Goal Kicks',
          '3.5 Goal Kicks',
          '4.5 Goal Kicks',
          '5.5 Goal Kicks',
          '6.5 Goal Kicks',
          '7.5 Goal Kicks',
          '8.5 Goal Kicks',
          '9.5 Goal Kicks',
          '10.5 Goal Kicks',
          '11.5 Goal Kicks',
          '12.5 Goal Kicks',
          '13.5 Goal Kicks',
          '14.5 Goal Kicks',
          '15.5 Goal Kicks',
          '16.5 Goal Kicks',
          '17.5 Goal Kicks',
          '18.5 Goal Kicks',
          '19.5 Goal Kicks',
          '20.5 Goal Kicks',
          '21.5 Goal Kicks',
          '22.5 Goal Kicks',
          '23.5 Goal Kicks',
          '24.5 Goal Kicks',
          '25.5 Goal Kicks',
          '26.5 Goal Kicks',
          '27.5 Goal Kicks',
          '28.5 Goal Kicks',
          '29.5 Goal Kicks',
          '30.5 Goal Kicks',
          '31.5 Goal Kicks',
          '32.5 Goal Kicks',
          '33.5 Goal Kicks',
          '34.5 Goal Kicks',
          '35.5 Goal Kicks',
          '36.5 Goal Kicks',
          '37.5 Goal Kicks',
          '38.5 Goal Kicks',
          '39.5 Goal Kicks',
          '40.5 Goal Kicks',
          '41.5 Goal Kicks',
          '42.5 Goal Kicks',
          '43.5 Goal Kicks',
          '44.5 Goal Kicks',
          '45.5 Goal Kicks',
          '46.5 Goal Kicks',
          '47.5 Goal Kicks',
          '48.5 Goal Kicks',
          '49.5 Goal Kicks',
        ],
      },
      { values: ['Match', '1st Half', '2nd Half', 'First 10 minute'] },
      { values: ['Both Teams Combined', homeTeam, awayTeam] },
    ],
  },
  {
    market: 'Winning Margin',
    options: [
      { values: [homeTeam, awayTeam, 'Either Team'] },
      { values: ['Match', '1st Half', '2nd Half', 'First 10 minute'] },
      {
        values: [
          '1 Goal',
          '2 Goals',
          '2 or more Goals',
          '3 Goals',
          '3 or more Goals',
          '4 Goals',
          '4 or more Goals',
          '5 Goals',
          '5 or more Goals',
          '6 Goals',
          '6 or more Goals',
          '7 Goals',
          '7 or more Goals',
        ],
      },
    ],
  },
];

@Component({
  selector: 'app-predictions-market-selection-dialog',
  templateUrl: './predictions-market-selection-dialog.component.html',
  styleUrls: ['./predictions-market-selection-dialog.component.scss'],
  providers: [PredictionResultPipe],
})
export class PredictionsMarketSelectionDialogComponent
  implements OnInit, OnDestroy {
  private _stop$: Subject<any>;

  match: any;
  predictions: any[];

  marketSelections: any[];
  selectedMarket: any;
  selectedMarketIndex: number;
  selectedMarketOptions: string[];

  isShowTable: boolean;

  // table variables
  displayedColumns: string[] = ['market-selection', 'prediction', 'actions'];
  dataSource = new MatTableDataSource([]);

  constructor(
    private readonly _store: StateService,
    private readonly _plannerService: PlannerService,
    private readonly _predictionResultPipe: PredictionResultPipe
  ) {
    this._setVariables();
  }

  ngOnInit(): void {
    this._setModalEventListener();
  }

  ngOnDestroy(): void {
    this._stop$.complete();
  }

  private _setVariables(): void {
    this._stop$ = new Subject();

    this.match = {};
    this.predictions = null;

    this.marketSelections = [];
    this.selectedMarket = null;
    this.selectedMarketIndex = null;
    this.selectedMarketOptions = [''];
    this.isShowTable = false;
  }

  private _setModalEventListener(): void {
    $('#predictions-market-selection-dialog').on('shown.bs.modal', () => {
      combineLatest([
        this._store.targetMatch.pipe(tap(this._setMatch.bind(this))),
        this._store.predictions.pipe(tap(this._setPredictions.bind(this))),
      ])
        .pipe(takeUntil(this._stop$))
        .subscribe(() => {});
    });

    $('#predictions-market-selection-dialog').on('hidden.bs.modal', () => {
      this._stop$.next();

      this.selectedMarket = null;
      this.selectedMarketIndex = null;
      this.selectedMarketOptions = [''];

      this.isShowTable = false;
      this.predictions = null;
    });
  }

  private _setMatch(match): void {
    this.match = match;
    const { home, away } = this.match;
    this.marketSelections = getMarketSelections(home, away);
  }

  private _setPredictions(predictions): void {
    this.predictions =
      predictions.filter((el) => el.matchId === this.match.matchId) || [];
    this.isShowTable = this.predictions.length !== 0;
    this.dataSource.data = this.predictions;
  }

  // new logic
  onSelectMarket(market, i): void {
    this.selectedMarket = market;
    this.selectedMarketIndex = i;
    this.selectedMarketOptions = [...this.selectedMarket.options].map(
      (el) => el.values[0]
    );
  }

  onDeselectMarket(): void {
    this.selectedMarket = null;
    this.selectedMarketIndex = null;
    this.selectedMarketOptions = [''];
  }

  onChangeMarketOption(event, i) {
    this.selectedMarketOptions = [
      ...this.selectedMarketOptions,
    ].map((opt, index) => (index === i ? event.value : opt));
  }

  onAddPrediction(): void {
    const prediction = {
      market: this.selectedMarket.market,
      matchId: this.match.matchId,
      outcome: this._predictionResultPipe.transform(
        this.selectedMarketOptions,
        this.selectedMarket
      ),
    };
    this._plannerService.createPrediction(prediction).subscribe(() => {});
  }

  onDeletePrediction(prediction): void {
    this._plannerService
      .deletePrediction(prediction.predictionId)
      .subscribe(() => {});
  }

  onAddAnotherPrediction(): void {
    this.isShowTable = false;
    this.selectedMarket = null;
    this.selectedMarketOptions = null;
    this.selectedMarketIndex = null;
  }

  onCancelMarketSelection(): void {
    $('#predictions-market-selection-dialog').modal('hide');
  }
}
