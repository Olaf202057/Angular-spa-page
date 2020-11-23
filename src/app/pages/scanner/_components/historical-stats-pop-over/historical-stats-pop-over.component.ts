import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-historical-stats-pop-over',
  templateUrl: './historical-stats-pop-over.component.html',
  styleUrls: ['./historical-stats-pop-over.component.scss']
})
export class HistoricalStatsPopOverComponent implements OnChanges {

  @Input()
  dataOptions = [];

  @Input()
  league;

  @Input()
  preMatchOdds;

  @Input()
  homeId;

  @Input()
  type;

  @Input()
  position: any;

  constructor(private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    if( this.position == undefined ) {
      return;
    }

    let tri_left = this.position.pos - 15;

    $('head').append('<style>.info-panel:before{left:' + tri_left + 'px !important;}</style>');
    $('head').append('<style>.info-panel:after{left:' + (tri_left + 1) + 'px !important;}</style>');

    if( this.position.state == 0 ) {
      $('head').append('<style>.info-panel:before, .info-panel:after{bottom: 100% !important; top: auto !important;}</style>');
      $('head').append('<style>.info-panel:before{border-bottom: 25px solid #146853 !important; border-top: none !important;}</style>');
      $('head').append('<style>.info-panel:after{border-bottom: 23px solid white !important; border-top: none !important;}</style>');
    } else {
      $('head').append('<style>.info-panel:before, .info-panel:after{top: 100% !important; bottom: auto !important;}</style>');
      $('head').append('<style>.info-panel:before{border-top: 25px solid #146853 !important; border-bottom: none !important;}</style>');
      $('head').append('<style>.info-panel:after{border-top: 23px solid white !important; border-bottom: none !important;}</style>');
    }
  }

  //btn btn-primary btn-circle


  getClass(option) {
    if (option && option.matchResult == 1) {
      return 'btn btn-grey btn-circle right-10 bottom-5';
    } else if (option && option.matchResult == 0) {
      return 'btn btn-red btn-circle right-10 bottom-5';
    } else if (option && option.matchResult == 2) {
      return 'btn btn-green btn-circle right-10 bottom-5';
    }
  }

  viewInfo() {
    this.router.navigateByUrl('scanner/form/' + this.homeId + "/" + this.type, { skipLocationChange: true });
  }

  isLight() {
    return environment.theme == 'light'
  }

}
