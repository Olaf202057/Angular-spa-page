import { Component, OnInit, Input } from '@angular/core';
import { MAIN_COLUMN_VISIBILITY_FIELD, STATS_FILTER_STAT_TYPE_OPTIONS, STAT_FILTER_COMPARARISON_TYPES } from './../config/grid-settings-config';
import { MessageService } from '../../message.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-stats-filter-popup',
  templateUrl: './stats-filter-popup.component.html',
  styleUrls: ['./stats-filter-popup.component.scss']
})
export class StatsFilterPopupComponent implements OnInit {

  selectedStatValue ;
  selectedFilterType ;
  value;


  filterTypes = STAT_FILTER_COMPARARISON_TYPES

  homeFilterCount = 0;
  awayFilterCount = 0;

  @Input()
  modal;

  @Input()
  gridNumber;

  statTypes ;

  goalNumbers;

  @Input()
  filters = [];

  @Input()
  scoreFilters = []


  homeGoal;
  awayGoal;


  constructor(private messageService: MessageService) {
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
    this.calculateLength();
    this.goalNumbers = this.generate(25)
  }

  generate(number){
    let num = [];
    for(var i = 0; i < number;i++){
      num.push(i);
    }
    return num;
  }

  selectHomeGoal(value){
    this.homeGoal = value;
  }

  selectAwayGoal(value){
    this.awayGoal = value;
  }



  calculateLength(){
    if(this.filters && this.filters.length){
      let home = this.filters.filter(value=>value.statType.appliesOn=='Home');
      let away = this.filters.filter(value=>value.statType.appliesOn=='Away');
      this.homeFilterCount = home ? home.length : 0;
      this.awayFilterCount = away ? away.length : 0;
    }
  }

  addFilter(){
    if(this.addFilterEnabled()){
      this.filters.push({
        statType:this.selectedStatValue,
        filterType: this.selectedFilterType,
        filterValue:this.value
      })
      this.calculateLength();
      this.applyFilters();
      this.clear();
    }
  }

  addFilterEnabled(){
    return this.selectedStatValue && this.selectedStatValue && this.value;
  }

  clearFilters(){
    this.filters = [];
    this.homeFilterCount = 0;
    this.awayFilterCount = 0;
  }

  removeFilter(index){
    this.filters.splice(index,1);
    this.applyFilters();
    this.calculateLength();
  }

  clear(){
    this.selectedStatValue =null;
     this.selectedStatValue = null;
      this.value = null
  }

  selectDropdownValue(value){
    this.selectedStatValue = value;
  }

  selectFilterType(value){
    this.selectedFilterType = value;
  }

  applyFilters(){
      this.messageService.applyStatsFilters({filters:this.filters,scoreFilters:this.scoreFilters,gridNumber:this.gridNumber});
  }

  isLight(){
    return environment.theme=='light';
  }

  addScoreFilter(){
    this.scoreFilters.push(this.homeGoal+"-"+this.awayGoal);
    this.applyFilters();
    this.clearScoreFilter();
  }

  addScoreFilterEnabled(){
    return this.homeGoal>=0 && this.awayGoal>=0;
  }

  clearScoreFilter(){
    this.homeGoal = undefined;
    this.awayGoal = undefined;
  }

  removeScoreFilters(index){
    this.scoreFilters.splice(index,1)
    this.applyFilters();
  }

  clearAllFilters(){
      this.filters = [];
      this.scoreFilters = [];
      this.applyFilters();
  }

}
