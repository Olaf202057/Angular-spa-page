import { OnChanges, SimpleChanges } from '@angular/core';
import { Component, Input, ElementRef } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

declare var $: any;

@Component({
  selector: 'app-momentum-spline-chart',
  templateUrl: './momentum-spline-chart.component.html',
  styleUrls: ['./momentum-spline-chart.component.scss']
})
export class MomentumSplineChartComponent implements OnChanges {
 // value injection
  @Input()
  dataOptions = {home:[],away:[],labels:[],homeName:'',awayName:''};

  @Input()
  labels = [];

  @Input()
  position: any;

  constructor(public ref: ElementRef) {
  }

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{ display: true}],
      xAxes: [{ display: true}] ,
    },
    elements:{
      point:{
        radius:0
      }
    }
  };

  public lineChartLabels: Label[] = ['0', '15', '30', '45', '60', '75', '90', '105', '120'];
  public lineChartType: ChartType = 'line';
  public lineChartLegend = true;
  public lineChartPlugins = [{
    annotation: {
      annotations: [{
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: 5,
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 4,
        label: {
          enabled: false,
          content: 'Test label'
        }
      }]
    }
  }];

  public lineChartData: ChartDataSets[] = [];

  public abstract_dataoption_home : any[] = [];
  public abstract_dataoption_away : any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    this.lineChartData = [];
    if (this.dataOptions) {

      this.abstract_dataoption_home = [];
      this.abstract_dataoption_away = [];

      for (var i = 0; i < this.dataOptions.home.length; i ++)
      {
        if (i % 15 == 0)
        {
          this.abstract_dataoption_home.push(this.dataOptions.home[i]);
          this.abstract_dataoption_away.push(this.dataOptions.away[i]);
        }
      }

      this.abstract_dataoption_home.push(this.dataOptions.home[i-1]);
      this.abstract_dataoption_away.push(this.dataOptions.away[i-1]);

      this.lineChartData.push({
        data: this.abstract_dataoption_home,
        label: this.dataOptions.homeName,
        backgroundColor:'#00b894',
        borderColor:'#00b894',
        fill:false,
      });

      this.lineChartData.push({
       data: this.abstract_dataoption_away,
       label: this.dataOptions.awayName,
       backgroundColor:'yellow',
       borderColor:'yellow',
       fill:false,
     });
    }

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
}
