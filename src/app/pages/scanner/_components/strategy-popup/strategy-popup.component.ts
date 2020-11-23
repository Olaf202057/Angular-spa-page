import { Component, OnInit, Input } from '@angular/core';
import {PlayService} from './../../play.service'

import { Subject } from 'rxjs';
import { filter, tap, takeUntil } from 'rxjs/operators';
import { MessageService } from '../../message.service';
import { MAIN_COLUMN_VISIBILITY_FIELD, STATS_FILTER_STAT_TYPE_OPTIONS, STAT_FILTER_COMPARARISON_TYPES } from './../config/grid-settings-config';
// import { StateService } from 'src/app/core/services';

@Component({
  selector: 'app-strategy-popup',
  templateUrl: './strategy-popup.component.html',
  styleUrls: ['./strategy-popup.component.scss']
})
export class StrategyPopupComponent implements OnInit {

  @Input()
  modal;

  @Input()
  filters = [];

  @Input()
  scoreFilters = [];

  @Input()
  gridNumber;

  strategies: any[];
  selectedStrategy: any;
  mainColumns: any[];
  prevStatsColumns: any[];
  miscColumns: any[];
  currentStrategy: any;
  statTypes ;
  filterTypes = STAT_FILTER_COMPARARISON_TYPES

  constructor(private service:PlayService, private messageService: MessageService) {
    this.statTypes = JSON.parse(JSON.stringify(STATS_FILTER_STAT_TYPE_OPTIONS));
    this.statTypes = this.statTypes.filter(stat=>{
        return stat!=null;
    })
    this.statTypes.sort(function(a, b){
      var x = a.value.toLowerCase();
      var y = b.value.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    });
   }

  ngOnInit(): void {
    this.service.getStrategyResults().subscribe(response=>{
      this.strategies = response;
      // console.log(response)
      // this.currentStrategy = response[0];
      // this.applyStrategy();
    });

    this.selectedStrategy = {
      mainTime: true ,
      mainScore: true ,
      mainTeams: true ,
      mainSearch: true ,
      mainCorners: true ,
      mainPossession: true,
      mainAttacks: true ,
      mainDangerousAttacks: true,
      mainYellowCards: true ,
      previousSonT: true ,
      previousSoffT: true ,
      previousAttacks: true ,
      previousDangerousAttacks: true ,
      previousCorners: true ,
      previousGoals: true ,
      previousIntensity: true ,
      miscMomentum: true ,
      miscAlerts: true ,
      miscDelete: true ,
      correctScoreFiltersList: [{homeGoals: 0, awayGoals: 0}],
      statsFiltersList : [{statType: "", operator: "", value: 0}]
    };
    this.mainColumns = [
      { label: 'Time', key: 'mainTime' },
      { label: 'Score', key: 'mainScore' },
      { label: 'Teams', key: 'mainTeams' },
      { label: 'Search', key: 'mainSearch' },
      { label: 'Corners', key: 'mainCorners' },
      { label: 'Possesion', key: 'mainPossession' },
      { label: 'Attacks', key: 'mainAttacks' },
      { label: 'Dangerous Attacks', key: 'mainDangerousAttacks' },
      { label: 'Yellow Cards', key: 'mainYellowCards' },
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

  selectDropdownValue(value) {
    this.currentStrategy = value;
    this.applySelect();
  }

  onClickVisibility(item): void {
    this.selectedStrategy = {
      ...this.selectedStrategy,
      [item.key]: !this.selectedStrategy[item.key],
    };
  }

  applySelect(): void {
    this.selectedStrategy = {
      ...this.selectedStrategy,
      mainTime: this.currentStrategy.mainTime,
      mainScore: this.currentStrategy.mainScore ,
      mainTeams: this.currentStrategy.mainTeams ,
      mainSearch: this.currentStrategy.mainSearch ,
      mainCorners: this.currentStrategy.mainCorners ,
      mainPossession: this.currentStrategy.mainPossession,
      mainAttacks: this.currentStrategy.mainAttacks ,
      mainDangerousAttacks: this.currentStrategy.mainDangerousAttacks,
      mainYellowCards: this.currentStrategy.mainYellowCards ,
      previousSonT: this.currentStrategy.previousSonT ,
      previousSoffT: this.currentStrategy.previousSoffT ,
      previousAttacks: this.currentStrategy.previousAttacks ,
      previousDangerousAttacks: this.currentStrategy.previousDangerousAttacks ,
      previousCorners: this.currentStrategy.previousCorners ,
      previousGoals: this.currentStrategy.previousGoals ,
      previousIntensity: this.currentStrategy.previousIntensity ,
      miscMomentum: this.currentStrategy.miscMomentum ,
      miscAlerts: this.currentStrategy.miscAlerts ,
      miscDelete: this.currentStrategy.miscDelete ,
      correctScoreFiltersList: this.currentStrategy.correctScoreFiltersList,
      statsFiltersList: this.currentStrategy.statsFiltersList
    }
  }

  applyStrategy() {
    this.addFilter();
    this.addScoreFilter();
  }

  addFilter(){
    if(this.currentStrategy.statsFiltersList && this.currentStrategy.statsFiltersList.length > 0) {
      this.filters = [];
      this.currentStrategy.statsFiltersList.map((item, index) => {
        if(this.addFilterEnabled(item)){
          this.filters.push({
            statType: item.statType,
            filterType: item.operator,
            filterValue: item.value
          })
        }
      })
      this.calculateLength();
      // this.applyFilters();
      // this.clear();
    }
  }

  addFilterEnabled(item){
    return item.statType && item.operator && item.value;
  }

  calculateLength(){
    if(this.filters && this.filters.length){
      let home = this.filters.filter(value=>value.statType.appliesOn=='Home');
      let away = this.filters.filter(value=>value.statType.appliesOn=='Away');
      // this.homeFilterCount = home ? home.length : 0;
      // this.awayFilterCount = away ? away.length : 0;
    }
  }

  addScoreFilter(){
    this.scoreFilters = [];
    this.selectedStrategy.correctScoreFiltersList.map((item, index) => {
      this.scoreFilters.push(item.homeGoals+"-"+item.awayGoals);
    })
    this.applyFilters();
    // this.clearScoreFilter();
  }

  applyFilters(){
    let tempFilters = [];
    this.filters.map((item) => {
      let tempStatType = this.statTypes.find(element => element.value.trim() == item.statType.trim());
      let tempFilterType = this.filterTypes.find(element => element.value.trim() == item.filterType.trim());
        if(tempStatType && tempFilterType) {
        let tempFilter = {
          statType: tempStatType,
          filterType: tempFilterType,
          filterValue: item.filterValue
        }
        tempFilters.push(tempFilter);
      }
    })
    this.messageService.applyStatsFilters({filters:tempFilters,scoreFilters:this.scoreFilters,gridNumber:this.gridNumber});
}

}
