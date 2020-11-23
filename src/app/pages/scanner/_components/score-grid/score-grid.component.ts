import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
  EmbeddedViewRef,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  ElementRef, HostListener
} from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  MAIN_COLUMN_VISIBILITY_FIELD,
  PREVIOUS_COLUMN_VISIBILITY_FIELD,
  MISC_VISIBILITY_FIELD,
  QUICK_FILTERS_GAMES_CURRENTLY_IN_CONFIG,
  QUICK_FILTERS_MISC_CONFIG,
  PREV_SELECT_OPTIONS,
} from './../config/grid-settings-config';
import { MessageService } from '../../message.service';
import { environment } from 'src/environments/environment';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { MomentumGraphComponent } from '../momentum-graph/momentum-graph.component';
// import { IncomingMessage } from 'http';

declare var $: any;

@Component({
  selector: 'app-score-grid',
  templateUrl: './score-grid.component.html',
  styleUrls: ['./score-grid.component.scss'],
})

export class ScoreGridComponent implements OnInit, AfterViewInit {

  @ViewChild('mygrid', { static: false }) mygrid: jqxGridComponent;
  @ViewChild('homeformPopover') homeFormPop: ElementRef;
  @ViewChild('awayformPopover') awayFormPop: ElementRef;
  @ViewChild('matchMomentum1') matchMomentum1: ElementRef;
  @ViewChild('matchMomentum2') matchMomentum2: ElementRef;

  curMatch: any;
  componentRef: any;

  defaultMainColumnVisibility = MAIN_COLUMN_VISIBILITY_FIELD;
  previousStatsColumnVisibility = PREVIOUS_COLUMN_VISIBILITY_FIELD;
  miscStatsColumnVisibility = MISC_VISIBILITY_FIELD;
  options = PREV_SELECT_OPTIONS;
  defaultGamesCurrentlyInFilters = QUICK_FILTERS_GAMES_CURRENTLY_IN_CONFIG;
  defaultMiscFilters = QUICK_FILTERS_MISC_CONFIG;
  gamesCurrentlyInFilters = [];
  miscFilters = [];
  searchValue;
  activeMainColumnVisibility = [];
  activePreviousStatsColumnVisibility = [];
  activeMiscStatsColumnVisibility = [];
  activeFilters = [];
  scoreFilters = [];
  closeResult = '';

  @Input() grid;
  @Input() gridName;
  @Input() gridNumber;

  sortedData = [];
  before_sortedData = [];
  before_sorted_flag: boolean = false;

  __originalData = [];

  lastTimeSelection = PREV_SELECT_OPTIONS[0];
  hide = false;
  type;
  gridNameEdit = false;
  color;
  bells = [];
  popover_pos: any;

  public static components: ScoreGridComponent[] = [];

  constructor(
    private modalService: NgbModal,
    private messageService: MessageService,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
  ) {
    ScoreGridComponent.components.push(this);
  }

  ngAfterViewInit(): void {

    // club search
    let searchTimer = null;
    const that = this;
    $('#mygrid').delegate('#id_clubsearch', 'keyup', function () {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
      let domThis = this;
      that.searchValue = domThis.value;

      searchTimer = setTimeout(() => {
        let value = domThis.value;
        searchTimer = null;
        that.sortedData = that.__originalData;

        if (!value) {
          that.updateGrid();
          return;
        }

        that.sortedData = that.sortedData.filter((res) => {
          let shouldSearchV = value.toLowerCase();
          if (res.battleWith.toLowerCase().includes(shouldSearchV)) {
            return true;
          }
          return false;
        });


        that.updateGrid();

      }, 300);
    });

    // prev state
    $('#id_prevstate').change({ state: this.lastTimeSelection }, (e) => {

      let name = e.target.value;
      let value = e.target.value;
      e.data.state = { name: name, value: value };
      this.lastTimeSelection = e.data.state;
      if(this.sortInfo.active != '' && this.sortInfo.direction != '') {
        const sortedField:string = this.sortInfo.active;
        const isLastFieldSorted = 
            sortedField.includes('last') ||
            sortedField === 'goals' ||
            sortedField === 'pressureIndex';
        isLastFieldSorted && this.sortData(this.sortInfo);
      }
      this.updateGrid();
    });

    // club info click event
    $('#mygrid').delegate('#id_club_info', 'click', { parent: this }, function (event) {
      const parent = event.data.parent;
      const dom = $(this);
      const boundRect: any = dom.get(0).getBoundingClientRect();
      const dom_pos = { x: boundRect.left + boundRect.width / 2, y: boundRect.top + boundRect.height / 2 };

      const club_key = dom.data('club-key');
      const club_type = dom.data('club-type');
      const club_info = JSON.parse(decodeURIComponent(dom.data('club-info')));

      const param = { match: club_info, value: club_type, position: dom_pos };

      const timerKey: string = 'clubName-' + club_key
      if (parent.clubNameTimer[timerKey]) {
        clearTimeout(parent.clubNameTimer[timerKey]);
      }
      parent.clubNameTimer[timerKey] = setTimeout(() => {
        delete parent.clubNameTimer[timerKey];
        parent.onClubInfoClick(param);
      }, 1);
    });
    // chart info click event
    $('#mygrid').delegate('#id_chart_info1', 'click', { parent: this }, function (event) {
      const parent = event.data.parent;
      const dom = $(this);
      const boundRect: any = dom.get(0).getBoundingClientRect();
      const dom_pos = { x: boundRect.left + boundRect.width / 2, y: boundRect.top + boundRect.height / 2 };

      const chart_key = dom.data('chart-key');
      const chart_type = dom.data('chart-type');
      const chart_info = JSON.parse(decodeURIComponent(dom.data('chart-info')));

      const param = { match: chart_info, value: chart_type, position: dom_pos };

      const timerKey: string = 'chart1Name-' + chart_key;
      if (parent.chart1Timer[timerKey]) {
        clearTimeout(parent.chart1Timer[timerKey]);
      }
      parent.chart1Timer[timerKey] = setTimeout(() => {
        delete parent.chart1Timer[timerKey];
        parent.onGraph1InfoClick(param);
      }, 1);
    });
    $('#mygrid').delegate('#id_chart_info2', 'click', { parent: this }, function (event) {
      const parent = event.data.parent;
      const dom = $(this);
      const boundRect: any = dom.get(0).getBoundingClientRect();
      const dom_pos = { x: boundRect.left + boundRect.width / 2, y: boundRect.top + boundRect.height / 2 };

      const chart_key = dom.data('chart-key');
      const chart_type = dom.data('chart-type');
      const chart_info = JSON.parse(decodeURIComponent(dom.data('chart-info')));

      const param = { match: chart_info, value: chart_type, position: dom_pos };

      const timerKey: string = 'chart2Name-' + chart_key;
      if (parent.chart2Timer[timerKey]) {
        clearTimeout(parent.chart2Timer[timerKey]);
      }

      parent.chart2Timer[timerKey] = setTimeout(() => {
        delete parent.chart2Timer[timerKey];
        parent.onGraph2InfoClick(param);
      }, 1);
    });
  }
  onScroll() {
    console.log("scrolled");
  }
  ngOnInit(): void {
    this.__originalData = this.grid.matches;
    this.sortedData = this.__originalData;
    this.source.totalrecords = this.sortedData.length;
    this.curMatch = this.sortedData[0];


    this.activeMainColumnVisibility = this.defaultMainColumnVisibility;
    this.activePreviousStatsColumnVisibility = this.previousStatsColumnVisibility;
    this.activeMiscStatsColumnVisibility = this.miscStatsColumnVisibility;
    this.gamesCurrentlyInFilters = this.defaultGamesCurrentlyInFilters;
    this.miscFilters = this.defaultMiscFilters;

    this.messageService.publishVisibilityEvent.subscribe((publishData) => {
      if (this.gridNumber == publishData.gridNumber) {
        // this.hide = true;
        this.activeMainColumnVisibility = publishData.activeMainColumnVisibility;
        this.activeMiscStatsColumnVisibility = publishData.activeMiscStatsColumnVisibility;
        this.activePreviousStatsColumnVisibility = publishData.activePreviousStatsColumnVisibility;
        // setTimeout(() => {
        //   this.hide = false;
        // }, 2);

        setTimeout(() => {
          this.activeMainColumnVisibility.forEach(item => {
            if (item.visible == false) {
              this.mygrid.hidecolumn(item.key);
            } else {
              this.mygrid.showcolumn(item.key);
            }
          });

          this.activeMiscStatsColumnVisibility.forEach(item => {
            if (item.visible == false) {
              this.mygrid.hidecolumn(item.key);
            } else {
              this.mygrid.showcolumn(item.key);
            }
          });

          this.activePreviousStatsColumnVisibility.forEach(item => {
            if (item.visible == false) {
              this.mygrid.hidecolumn(item.key);
            } else {
              this.mygrid.showcolumn(item.key);
            }
          });

          this.mygrid.updatebounddata();
        }, 300);
      }
    });

    if (this.isLight()) {
      this.color = '#146853';
    } else {
      this.color = '#ffd000';
    }

    this.messageService.publishQuickFiltersEvent.subscribe((data) => {
      if (this.gridNumber == data.gridNumber) {
        this.gamesCurrentlyInFilters = data.gamesCurrentlyInFilters;
        this.miscFilters = data.miscFilters;

        this.applyQuickFilters();
        this.before_sorted_flag = false;
        this.updateGrid();
      }
    });

    this.messageService.statsFilterEvent.subscribe((data) => {
      if (data.gridNumber == this.gridNumber) {
        this.activeFilters = data.filters;
        this.scoreFilters = data.scoreFilters;
        this.applyFilters(data.filters);
        this.applyScoreFilters(data.scoreFilters);
        this.before_sorted_flag = false;
        this.updateGrid();
      }
    });

    this.messageService.applyColorToGridEvent.subscribe((colorPublishData) => {
      if (colorPublishData.gridNumber == this.gridNumber) {
        this.color = colorPublishData.color;
      }
    });

    environment.headerWidth = 'responsive';

    // console.log(this.viewPort);
    // this.virtualScroll.elementScrolled()
    // .subscribe(event => {

    //   console.log('scrolled', event);
    // });

  }

  // public get inverseOfTranslation(): string {
  //   // console.log(this.viewPort);
  //   if (!this.viewPort || !this.viewPort['_renderedContentOffset']) {
  //     return '0px';
  //   }
  //   let offset = this.viewPort['_renderedContentOffset'];
  //   console.log(this.viewPort);
  //   // console.log(offset);
  //   // console.log(`-${offset}px`);
  //   return `-${offset}px`;
  // }
  // public get inverseOfTranslation1(): string {
  //   // console.log(this.viewPort);
  //   if (!this.viewPort || !this.viewPort['_renderedContentOffset']) {
  //     return '54px';
  //   }
  //   let offset = this.viewPort['_renderedContentOffset'] - 54;
  //   // console.log(`-${offset}px`);
  //   return `-${offset}px`;
  // }
  // public get inverseOfTranslation2():string {
  //   // console.log(this.viewPort);
  //   let offset: number;
  //   if (!this.viewPort || !this.viewPort['_renderedContentOffset']) {
  //     offset = 104;
  //   } else {
  //     offset = - (this.viewPort['_renderedContentOffset'] - 104);
  //   }
  //   return `${offset}px`;
  // }
  applyScoreFilters(filters) {
    this.sortedData = this.sortedData.filter((match) => {
      if (filters && filters.length) {
        return filters.indexOf(match.score) > -1;
      }
      return true;
    });
  }

  applyQuickFilters() {
    let sortedData = JSON.parse(JSON.stringify(this.__originalData)).filter(
      (match) => match
    );
    if (this.gamesCurrentlyInFilters && this.gamesCurrentlyInFilters.length) {
      let firstHalfCheck = false;
      let secondHalfCheck = false;
      let halfTimeCheck = false;
      let showAllCheck = true;
      this.gamesCurrentlyInFilters.forEach((filterOption) => {
        if (filterOption.key == 'firstHalf') {
          firstHalfCheck = filterOption.applyFilter;
        }

        if (filterOption.key == 'secondHalf') {
          secondHalfCheck = filterOption.applyFilter;
        }

        if (filterOption.key == 'halfTime') {
          halfTimeCheck = filterOption.applyFilter;
        }

        if (filterOption.key == 'showAll') {
          showAllCheck = filterOption.applyFilter;
        }
      });

      let drawCheck = false;
      let underdogCheck = false;
      let lowMomentumCheck = false;
      let highMomentumCheck = false;
      this.miscFilters.forEach((filterOption) => {
        if (filterOption.key == 'draw') {
          drawCheck = filterOption.applyFilter;
        }

        if (filterOption.key == 'underdogWinning') {
          underdogCheck = filterOption.applyFilter;
        }

        if (filterOption.key == 'lowAp') {
          lowMomentumCheck = filterOption.applyFilter;
        }

        if (filterOption.key == 'highAp') {
          highMomentumCheck = filterOption.applyFilter;
        }
      });

      this.sortedData = sortedData.filter((match) => {
        let retValue = showAllCheck;
        let gameTime = parseInt(match.gameTime + '');
        if (halfTimeCheck) {
          retValue = gameTime == 45;
        }

        if (firstHalfCheck) {
          retValue = retValue || gameTime < 45;
        }

        if (secondHalfCheck) {
          retValue = retValue || gameTime > 45;
        }

        return retValue;
      });

      this.sortedData = this.sortedData.filter((match) => {
        if (drawCheck) {
          return (
            match.statistics.totalAwayGoals + '' ==
            match.statistics.totalHomeGoals + ''
          );
        }
        return true;
      });

      this.sortedData = this.sortedData.filter((match) => {
        if (underdogCheck) {
          var isReallyUnderDogPerformance = false;

          if (match && match.preMatchOdds) {
            let underdogBase1 =
              parseFloat(match.preMatchOdds.homeOdds) <= 1.5 &&
              parseFloat(match.preMatchOdds.awayOdds) >= 5.0;
            let underdogBase2 =
              parseFloat(match.preMatchOdds.awayOdds) <= 1.5 &&
              parseFloat(match.preMatchOdds.homeOdds) >= 5.0;
            if (
              underdogBase1 &&
              parseInt(match.statistics.totalAwayGoals) >
              parseInt(match.statistics.totalHomeGoals)
            ) {
              isReallyUnderDogPerformance = true;
            } else if (
              underdogBase2 &&
              parseInt(match.statistics.totalHomeGoals) >
              parseInt(match.statistics.totalAwayGoals)
            ) {
              isReallyUnderDogPerformance = true;
            }
          }

          return isReallyUnderDogPerformance;
        }
        return true;
      });

      this.sortedData = this.sortedData.filter((match) => {
        if (lowMomentumCheck) {
          var isReallyWithLowMomentum = false;

          if (match && match.homeLast20 && match.awayLast20) {
            if (
              parseInt(match.homeLast20.pressureIndex) <= 30 &&
              parseInt(match.awayLast20.pressureIndex) <= 30
            ) {
              isReallyWithLowMomentum = true;
            }
          }

          return isReallyWithLowMomentum;
        }
        return true;
      });

      this.sortedData = this.sortedData.filter((match) => {
        if (highMomentumCheck) {
          var isReallyWithHighMomentum = false;

          if (match && match.homeLast20 && match.awayLast20) {
            if (
              parseInt(match.homeLast20.pressureIndex) >= 60 &&
              parseInt(match.awayLast20.pressureIndex) >= 30
            ) {
              isReallyWithHighMomentum = true;
            }
          }

          return isReallyWithHighMomentum;
        }
        return true;
      });
    }
  }

  applyFilters(filters) {
    if (!filters.length) {
      this.sortedData = this.__originalData.filter((match) => match);
    } else {
      this.sortedData = JSON.parse(
        JSON.stringify(this.__originalData)
      ).filter((match) => match);
      filters.forEach((filter) => {
        let field = filter.statType.key;
        let operator = filter.filterType.key;
        let value = filter.filterValue;
        this.sortedData = this.generateFilteredData(field, operator, value);
      });
    }
  }

  generateFilteredData(field, operator, value) {
    let sortedData = this.__originalData;
    return sortedData.filter((match) => {
      if (operator == 'equals') {
        return match['statistics'][field] == value;
      } else if (operator == 'lessThan') {
        return parseInt(match['statistics'][field] + '') < parseInt(value + '');
      } else if (operator == 'lessThanEquals') {
        return (
          parseInt(match['statistics'][field] + '') <= parseInt(value + '')
        );
      } else if (operator == 'greaterThan') {
        return parseInt(match['statistics'][field] + '') > parseInt(value + '');
      } else if (operator == 'greaterThanEquals') {
        return (
          parseInt(match['statistics'][field] + '') >= parseInt(value + '')
        );
      }
      return true;
    });
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  selectBell(match) {

    /* if(this.bells.indexOf(matchId)==-1){
          this.bells.push(matchId)
        } else{
          this.bells.splice(this.bells.indexOf(matchId),1)
        } */
    match.bell = !match.bell;
  }

  public isVisible(type, key) {
    var visibility = true;
    if (type == 'main') {
      this.activeMainColumnVisibility.forEach((condition) => {
        if (condition && condition.key == key) {
          visibility = condition.visible;
        }
      });
    } else if (type == 'previous') {
      this.activePreviousStatsColumnVisibility.forEach((condition) => {
        if (condition && condition.key == key) {
          visibility = condition.visible;
        }
      });
    } else if (type == 'misc') {
      this.activeMiscStatsColumnVisibility.forEach((condition) => {
        if (condition && condition.key == key) {
          visibility = condition.visible;
        }
      });
    }
    return visibility;
  }

  removeMatch(matchId) {
    this.sortedData = this.sortedData.filter((match) => {
      return match.matchId != matchId;
    });
  }

  gridToggle() {
    this.gridNameEdit = true;
    //alert(this.gridNameEdit)
  }

  isLight() {
    return environment.theme == 'light';
  }

  selectDropdownValue(value) {
    this.lastTimeSelection = value;
  }

  saveEditable() {
    this.grid.name = this.gridName;
    this.gridNameEdit = false;
  }

  cancelEditable() {
    this.gridName = this.grid.name;
    this.gridNameEdit = false;
  }

  updateSortArrow(sortInfo) {
    const field = sortInfo.active;
    const columnText = this.mygrid.getcolumn(field).text;
    const isLast = 
      field.includes('last') ||
      field === 'goals';
    const columnHeader = 
    $('img[src="assets/img/psd/' + columnText + '.png"]')
                  .filter(!isLast ? ':first' : ':eq(1)');
    const iconsContainer = columnHeader.parent().next();

    $(".iconscontainer").children().css({ "display": "none" });
    if (sortInfo.direction === "asc")
      iconsContainer.find(".sortasc").css({ "display": "block" });
    if (sortInfo.direction === "desc")
      iconsContainer.find(".sortdesc").css({ "display": "block" });
  }
  getLastSelectionInfo(a, b) {
    let Selection: any = {
      shotsOnTarget: '0',
      shotsOffTarget: '0',
      attacks: '0',
      dangerousAttacks: '0',
      corners: '0',
      goals: '0',
      pressureIndex: '0',
    };
    const aHomeLastSelection = 
      a['home' + this.lastTimeSelection.name] == null ?
       Selection : a['home' + this.lastTimeSelection.name];
    const aAwayLastSelection = 
      a['away' + this.lastTimeSelection.name] == null ?
       Selection : a['away' + this.lastTimeSelection.name];
    const bHomeLastSelection = 
      b['home' + this.lastTimeSelection.name] == null ?
        Selection : b['home' + this.lastTimeSelection.name];
    const bAwayLastSelection = 
      b['away' + this.lastTimeSelection.name] == null ?
        Selection : b['away' + this.lastTimeSelection.name];
    return {
      aTotalLastAttacks : 
        parseInt(aHomeLastSelection.attacks) +
        parseInt(aAwayLastSelection.attacks),
      bTotalLastAttacks : 
        parseInt(bHomeLastSelection.attacks) +
        parseInt(bAwayLastSelection.attacks), 
      aTotalLastDangerousAttacks : 
        parseInt(aHomeLastSelection.dangerousAttacks) +
        parseInt(aAwayLastSelection.dangerousAttacks),
      bTotalLastDangerousAttacks :
        parseInt(bHomeLastSelection.dangerousAttacks) +
        parseInt(bAwayLastSelection.dangerousAttacks),
      aTotalLastOnTarget :
        parseInt(aHomeLastSelection.shotsOnTarget) +
        parseInt(aAwayLastSelection.shotsOnTarget),
      bTotalLastOnTarget : 
        parseInt(bHomeLastSelection.shotsOnTarget) +
        parseInt(bAwayLastSelection.shotsOnTarget),
      aTotalLastOffTarget :
        parseInt(aHomeLastSelection.shotsOffTarget) +
        parseInt(aAwayLastSelection.shotsOffTarget),
      bTotalLastOffTarget :
        parseInt(bHomeLastSelection.shotsOffTarget) +
        parseInt(bAwayLastSelection.shotsOffTarget),
      aTotalLastCorners:
        parseInt(aHomeLastSelection.corners) +
        parseInt(aAwayLastSelection.corners),
      bTotalLastCorners:
        parseInt(bHomeLastSelection.corners) +
        parseInt(bAwayLastSelection.corners),
      aTotalLastGoals:
        parseInt(aHomeLastSelection.goals) +
        parseInt(aAwayLastSelection.goals),
      bTotalLastGoals:
        parseInt(bHomeLastSelection.goals) +
        parseInt(bAwayLastSelection.goals),
      aTotalLastPressureIndex:
        parseInt(aHomeLastSelection.pressureIndex) +
        parseInt(aAwayLastSelection.pressureIndex),
      bTotalLastPressureIndex:
        parseInt(bHomeLastSelection.pressureIndex) +
        parseInt(bAwayLastSelection.pressureIndex),
    }
  }
  sortData(sort: any) {
    this.updateSortArrow(sort);

    if (this.before_sorted_flag == false) {
      this.before_sortedData = this.sortedData;
      this.before_sorted_flag = true;
    }

    const data = this.sortedData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = this.before_sortedData;
      this.updateGrid();

      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      const lastSelectionInfo = this.getLastSelectionInfo(a, b);
      switch (sort.active) {
        case 'gameTime':
          return compare(parseInt(a.gameTime), parseInt(b.gameTime), isAsc);
        case 'score':
          return compare(
            parseInt(a.statistics.totalGoals),
            parseInt(b.statistics.totalGoals),
            isAsc
          );
        case 'attacks':
          return compare(
            parseInt(a.statistics.totalAttacks),
            parseInt(b.statistics.totalAttacks),
            isAsc
          );
        case 'dangerousAttacks':
          return compare(
            parseInt(a.statistics.totalDangerousAttacks),
            parseInt(b.statistics.totalDangerousAttacks),
            isAsc
          );
        case 'offTarget':
          return compare(
            parseInt(a.statistics.totalOffTarget),
            parseInt(b.statistics.totalOffTarget),
            isAsc
          );
        case 'onTarget':
          return compare(
            parseInt(a.statistics.totalOnTarget),
            parseInt(b.statistics.totalOnTarget),
            isAsc
          );
        case 'corners':
          return compare(
            parseInt(a.statistics.totalCorners),
            parseInt(b.statistics.totalCorners),
            isAsc
          );
        case 'yellowCards':
          return compare(
            parseInt(a.statistics.totalYellowCards),
            parseInt(b.statistics.totalYellowCards),
            isAsc
          );
        case 'redCards':
          return compare(
            parseInt(a.statistics.totalRedCards),
            parseInt(b.statistics.totalRedCards),
            isAsc
          );
        case 'lastAttacks':
          return compare(
            lastSelectionInfo.aTotalLastAttacks,
            lastSelectionInfo.bTotalLastAttacks,
            isAsc
          );
        case 'lastDangerousAttacks':
          return compare(
            lastSelectionInfo.aTotalLastDangerousAttacks,
            lastSelectionInfo.bTotalLastDangerousAttacks,
            isAsc
          );
        case 'lastOffTarget':
          return compare(
            lastSelectionInfo.aTotalLastOffTarget,
            lastSelectionInfo.bTotalLastOffTarget,
            isAsc
          );
        case 'lastOnTarget':
          return compare(
            lastSelectionInfo.aTotalLastOnTarget,
            lastSelectionInfo.bTotalLastOnTarget,
            isAsc
          );
        case 'lastCorners':
          return compare(
            lastSelectionInfo.aTotalLastCorners,
            lastSelectionInfo.bTotalLastCorners,
            isAsc
          );
        case 'goals':
          return compare(
            lastSelectionInfo.aTotalLastGoals,
            lastSelectionInfo.bTotalLastGoals,
            isAsc
          );
        case 'pressureIndex':
          return compare(
            lastSelectionInfo.aTotalLastPressureIndex,
            lastSelectionInfo.bTotalLastPressureIndex,
            isAsc
          );
        //case 'totalPossession': return compare(parseInt(a.statistics.totalHomePossession)+parseInt(a.statistics.totalAwayPossession), parseInt(b.statistics.totalHomePossession)+parseInt(b.statistics.totalAwayPossession), isAsc);
        case 'bell':
          return compare(a.bell, b.bell, isAsc);
        default:
          return 0;
      }
    });

    this.updateGrid();
  }

  public static setColorFromHeader(color) {
    ScoreGridComponent.components[0].color = color;
  }

  source: any =
    {
      datatype: 'array',
      localdata: {},
      totalrecords: 10000,
      sort: (col_name, sort_state, total_sort_state) => {
        let sort_information: any = {
          direction: '',
          active: col_name,
        };

        if (sort_state == true) {
          sort_information.direction = 'asc';
          this.sortData(sort_information);
        } else if (sort_state == false) {
          sort_information.direction = 'desc';
          this.sortData(sort_information);
        } else if (sort_state == null) {
          sort_information.direction = '';
          this.sortData(sort_information);
        }
        this.sortInfo = sort_information;
      },
      deleterow: function (rowid, commit) {
        commit(true);
        console.log("deleterow");
      },
    }
  
  sortInfo: {
    active: '',
    direction: ''
  };


  dataAdapter: any = new jqx.dataAdapter(this.source);
  rendergridrows = (params: any): any[] => {
    let data = this.generateData(params.startindex, params.endindex);
    return data;
  }

  headerrenderer = (value, align, columnsheight) => {

    if (value == "club") {
      let ret = '<div style="padding: 13px 10px;">';

      let defaultValue = this.searchValue || '';

      ret += '<input type="text" id="id_clubsearch" value="' + defaultValue + '">'

      ret += '</div>'
      return ret;
    }

    let text: any = "";
    if (value == 'momentum') {
      text = "Momentum";
    }
    return '<div class="grid-header-column "><img src="assets/img/psd/' + value + '.png")>' + text + '</div>';
  }

  cellsrenderer_normal = function (row, columnfield, value, defaulthtml, columnproperties) {
    if (value == '') {
      return '';
    }
    switch (columnfield) {
      case 'gameTime': case 'score':
        return '<div class="cellfont"><span>' + value + '</span></div>';
      case 'bell':
        return '<div class="grid-header-column"><img id="id_grid_bell" src="assets/img/psd/' + value + '.png"></div>';
      case 'remove':
        return '<div class="grid-header-column"><img id="id_grid_remove" src="assets/img/psd/' + value + '.png"></div>';
      default:
        let json_value = JSON.parse(value);
        return '<div class="cellfont"><span>' + json_value.value1 + '</span><span>' + json_value.value2 + '</span></div>';
    }
  }

  cellsrenderer_club = (row, columnfield, val, defaulthtml, columnproperties) => {
    if (val == '') {
      return '';
    }
    let value = JSON.parse(val);

    let match = value.match;
    let encoded_match = encodeURIComponent(JSON.stringify(value.match));

    let home: any = { Image: '', Name: '', Position: '' };
    if (match.homeImage && match.homeImage.imageUrl) {
      home.Image = '<img src="' + match.homeImage.imageUrl + '" style="width:25px !important;">';
    }
    home.Name = match.homeName;
    if (match.homePosition !== undefined) {
      home.Position = '<span style="margin-left: 3px;">(' + match.homePosition + ')</span>'
    }

    let away: any = { Image: '', Name: '', Position: '' };
    if (match.awayImage && match.awayImage.imageUrl) {
      away.Image = '<img src="' + match.awayImage.imageUrl + '" style="width:25px !important;">';
    }
    away.Name = match.awayName;
    if (match.awayPosition !== undefined) {
      away.Position = '<span style="margin-left: 3px;">(' + match.awayPosition + ')</span>'
    }

    let ret = '<div class="row cellfont" style="align-items: unset; margin-left: 15px;">' +
      '<div>' +
      home.Image +
      home.Name +
      home.Position +
      '<img id="id_club_info" data-club-key="' + row + '" data-club-info="' + encoded_match + '" data-club-type="Home" src="assets/img/psd/info.png" style="width:18px !important; cursor: pointer;  margin-left: 15px;">' +
      '</div>' +
      '<div>' +
      away.Image +
      away.Name +
      away.Position +
      '<img id="id_club_info" data-club-key="' + row + '" data-club-info="' + encoded_match + '" data-club-type="Away" src="assets/img/psd/info.png" style="width:18px !important; cursor: pointer;  margin-left: 15px;">' +
      '</div>' +
      '</div>';
    return ret;
  }

  cellsrenderer_chart = (row, columnfield, val, defaulthtml, columnproperties) => {
    if (val == '') {
      return '';
    }

    let value = JSON.parse(val);
    let match = value.match;
    let encoded_match = encodeURIComponent(JSON.stringify(value.match));
    let home: any = 0;
    let away: any = 0;
    let chart_no = 0;

    switch (columnfield) {
      case 'graphicalData1':
        home = this.get_avg(match.graphicalData1.home);
        away = this.get_avg(match.graphicalData1.away);
        chart_no = 1;
        break;
      case 'graphicalData2':
        home = this.get_avg(match.graphicalData2.home);
        away = this.get_avg(match.graphicalData2.away);
        chart_no = 2;
        break;
      default:
        break;
    }
    let ret = '<div class="row cellfont">' +
      '<span id="id_chart_info' + chart_no + '" data-chart-key="' + row + '" data-chart-info="' + encoded_match + '" data-chart-type="Home" style="cursor: pointer;">' +
      home +
      '</span>' +
      '<span id="id_chart_info' + chart_no + '" data-chart-key="' + row + '" data-chart-info="' + encoded_match + '" data-chart-type="Away" style="cursor: pointer;">' +
      away +
      '</span>' +
      '</div>';
    return ret;
  }

  get_avg(data): any {
    let avg = 0;
    if (data.length) {
      for (let i = 0; i < data.length; i++) {
        avg += data[i];
      }
      avg /= data.length;
    }
    return Math.ceil(avg);
  }

  loadComponent(component: any, ownerElement: any) {
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector, ownerElement);

    this.appRef.attachView(componentRef.hostView);


    const domElement = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    if (ownerElement) {
      ownerElement.appendChild(domElement);
    }

    this.componentRef = componentRef;

    return { componentRef: componentRef, domElement: domElement }
  }

  fitDOMPosition(dom: any, position) {
    let boundRect: any = dom.getBoundingClientRect();
    let state: any = 0;

    dom.style.left = Math.max(position.x - boundRect.width / 2, 0) + "px";

    dom.style.top = (position.y + 35) + "px";

    let dom_bottom = parseInt(dom.style.top) + dom.offsetHeight;
    let window_bottom = window.innerHeight;
    if (dom_bottom > window_bottom) {
      dom.style.top = (position.y - dom.offsetHeight - 35) + 'px';
      state = 1;
    }

    return { pos: Math.min(boundRect.width / 2, position.x), state: state };
  }

  onClubInfoClick(res: any) {
    this.curMatch = res.match;
    let elem: any;
    if (res.value == 'Home') {
      elem = this.homeFormPop.nativeElement;
      elem.style.display = 'block';

    } else if (res.value == 'Away') {
      elem = this.awayFormPop.nativeElement;
      elem.style.display = 'block';
    }

    this.popover_pos = this.fitDOMPosition(elem, res.position);
  }

  onGraph1InfoClick(res: any) {
    this.curMatch = res.match;
    let elem: any;

    elem = this.matchMomentum1.nativeElement;
    elem.style.display = 'block';

    this.popover_pos = this.fitDOMPosition(elem, res.position);
  }

  onGraph2InfoClick(res: any) {
    this.curMatch = res.match;
    let elem: any;
    elem = this.matchMomentum2.nativeElement;
    elem.style.display = 'block';
    this.popover_pos = this.fitDOMPosition(elem, res.position);
  }

  momentinumTimer: any = {};
  clubNameTimer: any = {};
  chart1Timer: any = {};
  chart2Timer: any = {};
  scrollRefreshTimer: any = null;

  columns: any[] =
    [
      { text: 'game_time', datafield: 'gameTime', columngroup: 'matchInfo', menu: false, width: 35, renderer: this.headerrenderer, cellsrenderer: this.cellsrenderer_normal, sortable: true },
      { text: 'ball', datafield: 'score', columngroup: 'matchInfo', menu: false, width: 28, renderer: this.headerrenderer, cellsrenderer: this.cellsrenderer_normal },
      { text: 'club', datafield: 'clubName', columngroup: 'matchInfo', menu: false, minwidth: 220, filterable: true, renderer: this.headerrenderer, cellsrenderer: this.cellsrenderer_club, sortable: false },
      { text: 'shots_on', datafield: 'onTarget', columngroup: 'matchInfo', menu: false, width: 35, cellsrenderer: this.cellsrenderer_normal, renderer: this.headerrenderer },
      { text: 'shots_off', datafield: 'offTarget', columngroup: 'matchInfo', menu: false, width: 35, cellsrenderer: this.cellsrenderer_normal, renderer: this.headerrenderer },
      { text: 'attack', datafield: 'attacks', columngroup: 'matchInfo', width: 35, menu: false, cellsrenderer: this.cellsrenderer_normal, renderer: this.headerrenderer },
      { text: 'd_attack', datafield: 'dangerousAttacks', columngroup: 'matchInfo', menu: false, width: 35, cellsrenderer: this.cellsrenderer_normal, renderer: this.headerrenderer },
      { text: 'corner', datafield: 'corners', columngroup: 'matchInfo', width: 35, menu: false, cellsrenderer: this.cellsrenderer_normal, renderer: this.headerrenderer },
      { text: 'possession', datafield: 'possession', columngroup: 'matchInfo', menu: false, width: 35, cellsrenderer: this.cellsrenderer_normal, renderer: this.headerrenderer, sortable: true },
      { text: 'yellow_card', datafield: 'yellowCards', columngroup: 'matchInfo', menu: false, width: 35, cellsrenderer: this.cellsrenderer_normal, renderer: this.headerrenderer },
      { text: 'red_card', datafield: 'redCards', columngroup: 'matchInfo', menu: false, width: 35, cellsrenderer: this.cellsrenderer_normal, renderer: this.headerrenderer },
      { text: 'chart1', datafield: 'graphicalData1', columngroup: 'matchInfo', menu: false, width: 35, renderer: this.headerrenderer, cellsrenderer: this.cellsrenderer_chart, sortable: false },
      { text: 'chart2', datafield: 'graphicalData2', columngroup: 'matchInfo', menu: false, width: 35, renderer: this.headerrenderer, cellsrenderer: this.cellsrenderer_chart, cellclassname: 'borderlessRow', classname: 'borderlessRow', sortable: false },
      { text: 'shots_on', datafield: 'lastOnTarget', columngroup: 'previousStats', menu: false, width: 35, cellsrenderer: this.cellsrenderer_normal, renderer: this.headerrenderer, sortable: true },
      { text: 'shots_off', datafield: 'lastOffTarget', columngroup: 'previousStats', menu: false, width: 35, cellsrenderer: this.cellsrenderer_normal, renderer: this.headerrenderer, sortable: true },
      { text: 'attack', datafield: 'lastAttacks', columngroup: 'previousStats', menu: false, width: 35, cellsrenderer: this.cellsrenderer_normal, renderer: this.headerrenderer, sortable: true },
      { text: 'd_attack', datafield: 'lastDangerousAttacks', menu: false, columngroup: 'previousStats', width: 35, cellsrenderer: this.cellsrenderer_normal, renderer: this.headerrenderer, sortable: true },
      { text: 'corner', datafield: 'lastCorners', menu: false, columngroup: 'previousStats', width: 35, cellsrenderer: this.cellsrenderer_normal, renderer: this.headerrenderer, sortable: true },
      { text: 'ball', datafield: 'goals', columngroup: 'previousStats', menu: false, width: 35, cellsrenderer: this.cellsrenderer_normal, renderer: this.headerrenderer, sortable: true },
      { text: 'pressure', datafield: 'pressureIndex', columngroup: 'previousStats', menu: false, width: 35, cellsrenderer: this.cellsrenderer_normal, renderer: this.headerrenderer, cellclassname: 'borderlessRow', classname: 'borderlessRow', sortable: true },
      {
        text: 'momentum', datafield: 'momentum', columngroup: 'other', menu: false, width: 120, createwidget: (row: number, column: any, value: any, htmlElement: HTMLElement): void => { },
        initwidget: (row: number, column: any, value: any, htmlElement: HTMLElement) => {
          if (value == "") {
            return;
          }
          const timerKey: string = 'momentum-' + row;
          if (this.momentinumTimer[timerKey]) {
            clearTimeout(this.momentinumTimer[timerKey]);
          }
          this.momentinumTimer[timerKey] = setTimeout(() => {
            delete this.momentinumTimer[timerKey];
            htmlElement.innerHTML = '';

            let container = document.createElement('div');
            htmlElement.appendChild(container);
            let result = this.loadComponent(MomentumGraphComponent, container);
            (<MomentumGraphComponent>result.componentRef.instance).dataOptions = value.barGraphData;

            // refresh scroll
            if (this.scrollRefreshTimer) {
              clearTimeout(this.scrollRefreshTimer);
              this.scrollRefreshTimer = null;
            }
            this.scrollRefreshTimer = setTimeout(() => {
              this.scrollRefreshTimer = null;
              const scroll = this.mygrid.scrollposition();
              if (scroll.top === 0) {
                window.dispatchEvent(new Event('resize'));
              }
            }, 1000);
          }, 1000);

        },
        renderer: this.headerrenderer, sortable: false
      },
      { text: 'bell', datafield: 'bell', columngroup: 'other', menu: false, width: 35, cellsrenderer: this.cellsrenderer_normal, renderer: this.headerrenderer, sortable: false },
      { text: 'trash', datafield: 'remove', columngroup: 'other', menu: false, width: 35, cellsrenderer: this.cellsrenderer_normal, renderer: this.headerrenderer, sortable: false },
    ];

  columngrouprenderer = function (value) {
    let result: any = '<div class="column-group-content"><span>' + value + '</span>';
    if (value == 'Previous Stats') {
      result += '<select id="id_prevstate">' +
        '<option value="Last5">Last 5 mins</option>' +
        '<option value="Last10">Last 10 mins</option>' +
        '<option value="Last20">Last 20 mins</option>' +
        '</select>';
    }
    result += '</div>';
    return result;
  }

  columngroups: any[] =
    [
      { text: 'Match Info', align: 'left', name: 'matchInfo', renderer: this.columngrouprenderer },
      { text: 'Previous Stats', align: 'left', name: 'previousStats', renderer: this.columngrouprenderer },
      { text: '', align: 'left', name: 'other' },
    ];

  generateData(startindex: number, endindex: number): any {
    let data = {};
    for (let i = startindex; i < endindex; i++) {
      if (i >= this.sortedData.length) {
        break;
      }
      let row = {};
      let match = this.sortedData[i];
      let match_stat = match.statistics;

      row['gameTime'] = match.gameTime;
      row['score'] = match.score;

      let clubNameData = {
        homeForm: match.homeForm,
        homeImage: match.homeImage,
        homeName: match.homeName,
        homePosition: match.homePosition,
        homeId: match.homeId,
        awayForm: match.awayForm,
        awayImage: match.awayImage,
        awayName: match.awayName,
        awayPosition: match.awayPosition,
        preMatchOdds: match.preMatchOdds,
        awayId: match.awayId,
        league: match.league,
      };

      row['clubName'] = JSON.stringify({ match: clubNameData });
      row['onTarget'] = JSON.stringify({ value1: match_stat.totalHomeOnTarget, value2: match_stat.totalAwayOnTarget });
      row['offTarget'] = JSON.stringify({ value1: match_stat.totalHomeOffTarget, value2: match_stat.totalAwayOffTarget });
      row['attacks'] = JSON.stringify({ value1: match_stat.totalHomeAttacks, value2: match_stat.totalAwayAttacks });
      row['dangerousAttacks'] = JSON.stringify({ value1: match_stat.totalHomeDangerousAttacks, value2: match_stat.totalAwayDangerousAttacks });
      row['corners'] = JSON.stringify({ value1: match_stat.totalHomeCorners, value2: match_stat.totalAwayCorners });
      row['possession'] = JSON.stringify({ value1: match_stat.totalHomePossession, value2: match_stat.totalAwayPossession });
      row['yellowCards'] = JSON.stringify({ value1: match_stat.totalHomeYellowCards, value2: match_stat.totalAwayYellowCards });
      row['redCards'] = JSON.stringify({ value1: match_stat.totalHomeRedCards, value2: match_stat.totalAwayRedCards });

      let graphData = {
        graphicalData1: match.graphicalData1,
        graphicalData2: match.graphicalData2,
        splineGraphLabel: match.splineGraphLabel,
      }

      row['graphicalData1'] = JSON.stringify({ match: graphData });
      row['graphicalData2'] = JSON.stringify({ match: graphData });

      let Selection: any = {
        shotsOnTarget: '0',
        shotsOffTarget: '0',
        attacks: '0',
        dangerousAttacks: '0',
        corners: '0',
        goals: '0',
        pressureIndex: '0',
      };
      let homeLastSelection = match['home' + this.lastTimeSelection.name] == null ? Selection : match['home' + this.lastTimeSelection.name];
      let awayLastSelection = match['away' + this.lastTimeSelection.name] == null ? Selection : match['away' + this.lastTimeSelection.name];

      row['lastOnTarget'] = JSON.stringify({ value1: homeLastSelection.shotsOnTarget, value2: awayLastSelection.shotsOnTarget });
      row['lastOffTarget'] = JSON.stringify({ value1: homeLastSelection.shotsOffTarget, value2: awayLastSelection.shotsOffTarget });
      row['lastAttacks'] = JSON.stringify({ value1: homeLastSelection.attacks, value2: awayLastSelection.attacks });
      row['lastDangerousAttacks'] = JSON.stringify({ value1: homeLastSelection.dangerousAttacks, value2: awayLastSelection.dangerousAttacks });
      row['lastCorners'] = JSON.stringify({ value1: homeLastSelection.corners, value2: awayLastSelection.corners });
      row['goals'] = JSON.stringify({ value1: homeLastSelection.goals, value2: awayLastSelection.goals });
      row['pressureIndex'] = JSON.stringify({ value1: homeLastSelection.pressureIndex, value2: awayLastSelection.pressureIndex });
      row['momentum'] = { barGraphData: match.barGraphData };

      if (match.bell == true) {
        row['bell'] = 'bell_off';
      } else {
        row['bell'] = 'bell_on';
      }
      row['remove'] = 'remove';

      data[i] = row;
    }
    return data;
  }

  CellClick(event) {
    var datafield = event.args.datafield;
    var rowindex = event.args.rowindex;

    if (datafield == 'remove') {
      this.mygrid.deleterow(rowindex);
      this.sortedData.splice(rowindex, 1);
      this.updateGrid();
    } else if (datafield == 'bell') {
      this.sortedData[rowindex].bell = !this.sortedData[rowindex].bell;
      console.log(this.sortedData[rowindex].bell);
      this.updateGrid();
    }
  }

  isContain(dom: any, point: any): any {
    let boundRect: any = dom.getBoundingClientRect();
    if (point.x > boundRect.left && point.x < boundRect.right) {
      if (point.y > boundRect.top && point.y < boundRect.bottom) {
        return true;
      }
    }
    return false;
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(event: MouseEvent) {
    let elem: any;
    elem = this.homeFormPop.nativeElement;
    if (elem.style.display == 'block' && this.isContain(elem, { x: event.x, y: event.y }) == false) {
      elem.style.display = 'none';
    }

    elem = this.awayFormPop.nativeElement;
    if (elem.style.display == 'block' && this.isContain(elem, { x: event.x, y: event.y }) == false) {
      elem.style.display = 'none';
    }

    elem = this.matchMomentum1.nativeElement;
    if (elem.style.display == 'block' && this.isContain(elem, { x: event.x, y: event.y }) == false) {
      elem.style.display = 'none';
    }

    elem = this.matchMomentum2.nativeElement;
    if (elem.style.display == 'block' && this.isContain(elem, { x: event.x, y: event.y }) == false) {
      elem.style.display = 'none';
    }
  }
  // @HostListener('window:scroll', ['$event'])
  // onWindowScroll(event) {
  //   alert(1);
  //   let elem: any;
  //   elem = this.homeFormPop.nativeElement;
  //   elem.style.display = 'none';

  //   elem = this.awayFormPop.nativeElement;
  //   elem.style.display = 'none';

  //   elem = this.matchMomentum1.nativeElement;
  //   elem.style.display = 'none';

  //   elem = this.matchMomentum2.nativeElement;
  //   elem.style.display = 'none';
  // }

  updateGrid() {
    this.source.totalrecords = this.sortedData.length;
    this.mygrid.updatebounddata();
  }
}

function compare(a: number, b: number, isAsc: boolean) {
  // var state;
  // switch (direction) {
  //   case 'asc':
  //     state = 1;
  //     break;
  //   case 'desc':
  //     state = -1;
  //     break;
  //   default:
  //     state = 0;
  // }
  // return (a < b ? -1 : 1) * state;
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

