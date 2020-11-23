import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatSort } from '@angular/material/sort';
import {FormControl} from '@angular/forms';

import { filter, tap } from 'rxjs/operators';

import * as moment from 'moment';

import { StateService } from 'src/app/core/services';
// import { userInfo } from 'os';
import { PlannerService } from 'src/app/core/services';
declare const $: any;

export interface IUpcomingMatch {
  kickOffTime: any;
  country: any;
  league: any;
  home: any;
  homeId: any;
  homeImg?: any;
  away: any;
  awayId: any;
  awayImg?: any;
  matchId: any;
  upcomingMatchId: any;
}

const ELEMENT_DATA: IUpcomingMatch[] = [];

@Component({
  selector: 'app-upcoming-events-table',
  templateUrl: './upcoming-events-table.component.html',
  styleUrls: ['./upcoming-events-table.component.scss'],
})
export class UpcomingEventsTableComponent implements OnInit, AfterViewInit {
  matches: any[];
  teamImages: any[];

  // material-table variables
  displayedColumns: string[] = [
    'kick-off',
    'country',
    'league',
    'home',
    'away',
    'predictions',
    'notes',
    'strategies'
  ];
  dataSource = new TableVirtualScrollDataSource<IUpcomingMatch>(ELEMENT_DATA);
  toppings = new FormControl();
  strategies = [];
  strategyMatches = [];
  @ViewChild('containerTable') containerTable: CdkVirtualScrollViewport;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly _cdRef: ChangeDetectorRef,
    private readonly _store: StateService,
    private readonly plannerService: PlannerService
  ) { }

  ngOnInit(): void {
    this.getTeamImages();
    this.getMatches();
    this.getStrategies();
    this.getStrategyMatches();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.onResize();
    setTimeout(() => {
      this.onResize();
    }, 1000);
  }

  getStrategies() {
    this._store.strategies
      .pipe(
        filter(Boolean),
        tap((strategies: any) => {
          this.strategies = strategies;
          this._cdRef.detectChanges();
        })
      )
      .subscribe(() => {})
  }

  getStrategyMatches() {
    this._store.strategyMatches
      .subscribe((strategyMatches) => {
        if(strategyMatches)
          this.strategyMatches = strategyMatches;
      })
  }
  getMatches(): void {
    this._store.upcomingMatches
      .pipe(
        filter(Boolean),
        tap((matches: any) => {
          this.matches = matches;
          // set upcoming events table data
          const data = this.matches.map((match) => ({
            kickOffTime: moment(match.kickOffTime).format('MM/DD HH:mm'),
            country: match.country,
            league: match.league,
            home: match.homeName,
            homeId: match.homeId,
            homeImg: this.teamImages.find((el) => el.teamId === match.homeId)
              ?.imageUrl,
            away: match.awayName,
            awayId: match.awayId,
            awayImg: this.teamImages.find((el) => el.teamId === match.awayId)
              ?.imageUrl,
            matchId: match.matchId,
            upcomingMatchId: match.upcomingMatchId,
          }));
          // debugger;
          this.dataSource.data = data;
          this._cdRef.detectChanges();
        })
      )
      .subscribe(() => { });
  }

  getTeamImages() {
    this._store.teamImages
      .pipe(
        filter(Boolean),
        tap((images: any) => {
          this.teamImages = images;
        })
      )
      .subscribe(() => { });
  }

  onAddPredictions(event, match): void {
    event.preventDefault();
    this._store.setTargetMatch(match);
    $('#predictions-market-selection-dialog').modal('show');
  }

  onAddNotes(event, match): void {
    event.preventDefault();
    this._store.setTargetMatch(match);
    $('#note-dialog').modal('show');
  }

  onChangeStrategyMatch(event, strategy, match): void {
    const strategyMatchId = this.getStrategyMatchId(strategy, match);
    if(event.target.checked === true) {
      this.plannerService.addStrategyMatch({
        strategyId: strategy.strategyId,
        matchId: match.matchId
      })
      .subscribe(
        () => {
          this.getStrategyMatches();
        }
      );
    } else {
      if(strategyMatchId == -1) {
        alert('Not found the strategy Match Id');
        return;
      }
      this.plannerService
        .deleteStrategyMatch(strategyMatchId)
        .subscribe(() => {});
    }
  }

  getStrategyMatchId(strategy, match): number {
    const length = this.strategyMatches.length;
    let index;
    for (index = 0; index < length; index++) {
      const strategyMatch = this.strategyMatches[index];
      if (
        strategyMatch &&
        strategyMatch.strategyId == strategy.strategyId &&
        strategyMatch.matchId == match.matchId
      )
        return strategyMatch.strategyMatchId;
    }
    return -1;
  }
  isLinked(strategy, match): Boolean {
    return this.getStrategyMatchId(strategy, match) != -1;
  }
  @HostListener('window:resize')
  onResize() {
    const dom: any = this.containerTable.elementRef.nativeElement;
    const boundRect: any = dom.getBoundingClientRect();
    const availHeight = window.innerHeight;
    const footer: any = document.querySelector('footer');
    const footerHeight = footer.offsetHeight;

    dom.style.height = (availHeight - boundRect.top - footerHeight) + 'px';
  }
}
