import { Component, OnInit, Input, HostListener } from '@angular/core';
import { PlayService } from './../../play.service';
import * as moment from 'moment'; // add this 1 of 4
import { MessageService } from '../../message.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { trigger, style, animate, transition } from '@angular/animations';
import { pre_result, userPredictions } from './result';

import { data } from './data';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        // style({transform: 'translateY(0)', opacity: 0.8}),
        // animate('500ms', style({transform: 'translateY(100%)', opacity: 1}))
        style({ height: '0px', opacity: 0 }),
        animate('500ms', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        // style({transform: 'translateY(0)', opacity: 1}),
        // animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
        // style({transform: 'translateX(0)', opacity: 1}),
        // animate('500ms', style({transform: 'translateX(100%)', opacity: 1}))
        style({ height: '*', opacity: 1 }),
        animate('500ms', style({ height: '0px', opacity: 0 }))
      ])
    ]
    )
  ],
})
export class HomeComponent implements OnInit {


  currentDate = new Date();
  results;
  momentumValue;
  grids = [];
  loaded = false;
  matches;
  userPredictions = [];
  preMatchFlag = false;
  preHeight = 0;

  preMatchOddsData = {
    homeOdds: '0',
    drawOdds: '0',
    awayOdds: '0'
  };
  
  constructor(private service: PlayService, private messageService: MessageService) {

  }

  isLight(): boolean {
    return environment.theme == 'light';
  }

  addNewGrid() {
    let grid = {
      name: "Grid Example " + (this.grids.length + 1),
      matches: this.matches
    }
    this.grids.push(grid);
  }

  getGridName(i) {
    return "Grid Example " + i;
  }

  getMomentumValueForSpline(graphData) {
    let data = graphData;
    let array = [];
    if (data) {
      let jsonGraph = JSON.parse(data.replace("/\/g", ""));

      for (var key of Object.keys(jsonGraph)) {
        array.push(jsonGraph[key])
      }
    }

    return array;
  }

  getLabel(graphData) {
    let data = graphData;
    let array = [];
    if (data) {
      let jsonGraph = JSON.parse(data.replace("/\/g", ""));

      for (var key of Object.keys(jsonGraph)) {
        if (jsonGraph[key] >= 0) {
          array.push((parseInt(key + '') + 1) + '')
        }
      }
    }

    return array;
  }

  getMomentumValue(inMatch) {
    let data = inMatch.momentumGraph.graphData;
    let array = [];
    if (data) {
      let jsonGraph = JSON.parse(data.replace("/\/g", ""));

      for (var key of Object.keys(jsonGraph)) {
        if (jsonGraph[key] != '0' && array.length < 20) {
          array.push(jsonGraph[key])
        }
      }
    }
    return array;
  }

  showPredictionTable() {
    this.preMatchFlag = !this.preMatchFlag;
  }

  setResultVar(result: any): void {
    this.results = result;
    let matches = this.results.filter(match => {
      match['kickOffTime'] = moment(match['kickOffTime']);
      if (environment.fullGridLoad) {
        return true;
      }
      if (match['kickOffTime'].toDate() > moment().subtract({ days: environment.gridLoadBeforeDays }).toDate()) {
        return true;
      }
      return false;
    });
    matches.forEach(inMatch => {
      inMatch.splineGraphDataHome1 = this.getMomentumValueForSpline(
        inMatch.attackingPressureGraphs[0].graphData);
      inMatch.splineGraphDataAway1 = this.getMomentumValueForSpline(
        inMatch.attackingPressureGraphs[2].graphData);
      inMatch.splineGraphDataHome2 = this.getMomentumValueForSpline(
        inMatch.attackingPressureGraphs[1].graphData);
      inMatch.splineGraphDataAway2 = this.getMomentumValueForSpline(
        inMatch.attackingPressureGraphs[3].graphData);


      inMatch.graphicalData1 = { home: [], away: [] }
      inMatch.graphicalData1.home = inMatch.splineGraphDataHome1
      inMatch.graphicalData1.away = inMatch.splineGraphDataAway1
      inMatch.graphicalData1.homeName = inMatch.homeName
      inMatch.graphicalData1.awayName = inMatch.awayName

      inMatch.graphicalData2 = { home: [], away: [] }
      inMatch.graphicalData2.home = inMatch.splineGraphDataHome2
      inMatch.graphicalData2.away = inMatch.splineGraphDataAway2
      inMatch.splineGraphLabel = this.getLabel(inMatch.attackingPressureGraphs[1].graphData)
      inMatch.graphicalData2.homeName = inMatch.homeName
      inMatch.graphicalData2.awayName = inMatch.awayName

      inMatch.barGraphData = this.getMomentumValue(inMatch)
      inMatch.battleWith = inMatch.homeName + " vs " + inMatch.awayName;
      inMatch.bell = false;

      if( inMatch.preMatchOdds == null ) {
        inMatch.preMatchOdds = this.preMatchOddsData;
      }
    });
    this.matches = matches;
    this.addNewGrid()
    this.loaded = true;
  }

  ngOnInit(): void {
    let env = 'test1';

    if (env == 'test') {
      this.loaded = true;
      // let result: any = { "matchId": 1818, "apiMatchID": 2190955, "homeId": 160121, "awayId": 160122, "homeName": "B36 Torshavn", "awayName": "KÍ Klaksvík", "league": "Faroe Islands Premier League", "homePosition": 4, "awayPosition": 3, "score": "5-2", "kickOffTime": "2020-07-12T14:00:00", "gameTime": "87", "timeStatus": "1", "statistics": { "statsId": 61, "matchId": 2190955, "currentGameTime": "87", "totalHomeAttacks": "107", "totalHomeDangerousAttacks": "87", "totalHomeOffTarget": "4", "totalHomeOnTarget": "8", "totalHomeCorners": "5", "totalHomeGoals": "5", "totalHomePossession": "57", "totalHomeYellowCards": "3", "totalHomeRedCards": "0", "totalAwayAttacks": "72", "totalAwayDangerousAttacks": "56", "totalAwayOffTarget": "4", "totalAwayOnTarget": "4", "totalAwayCorners": "6", "totalAwayGoals": "2", "totalAwayPossession": "43", "totalAwayYellowCards": "3", "totalAwayRedCards": "2", "totalAttacks": "179", "totalDangerousAttacks": "143", "totalOffTarget": "8", "totalOnTarget": "12", "totalCorners": "11", "totalYellowCards": "6", "totalRedCards": "2", "totalGoals": "10" }, "momentumGraph": { "inplayGraphId": 194, "matchId": 2190955, "statsId": 0, "teamId": 0, "graphTypeId": 1, "graphData": "{\"0\":-3,\"1\":-2,\"2\":-1,\"3\":-4,\"4\":-7,\"5\":-6,\"6\":-3,\"7\":-8,\"8\":3,\"9\":7,\"10\":2,\"11\":6,\"12\":3,\"13\":-4,\"14\":1,\"15\":-2,\"16\":-1,\"17\":1,\"18\":4,\"19\":-1,\"20\":7,\"21\":2,\"22\":11,\"23\":0,\"24\":5,\"25\":5,\"26\":7,\"27\":-4,\"28\":-6,\"29\":4,\"30\":10,\"31\":-1,\"32\":7,\"33\":-2,\"34\":5,\"35\":1,\"36\":4,\"37\":-7,\"38\":6,\"39\":6,\"40\":2,\"41\":7,\"42\":-3,\"43\":0,\"44\":0,\"45\":12,\"46\":-5,\"47\":0,\"48\":-4,\"49\":-5,\"50\":9,\"51\":5,\"52\":0,\"53\":-5,\"54\":5,\"55\":2,\"56\":2,\"57\":12,\"58\":7,\"59\":-5,\"60\":-8,\"61\":1,\"62\":5,\"63\":0,\"64\":0,\"65\":0,\"66\":0,\"67\":0,\"68\":0,\"69\":0,\"70\":0,\"71\":0,\"72\":0,\"73\":0,\"74\":0,\"75\":0,\"76\":0,\"77\":0,\"78\":0,\"79\":0,\"80\":0,\"81\":0,\"82\":0,\"83\":0,\"84\":0,\"85\":0,\"86\":0,\"87\":0,\"88\":0,\"89\":0,\"90\":0,\"91\":0,\"92\":0,\"93\":0,\"94\":0,\"95\":0,\"96\":0,\"97\":0,\"98\":0,\"99\":0,\"100\":0,\"101\":0,\"102\":0,\"103\":0,\"104\":0,\"105\":0,\"106\":0,\"107\":0,\"108\":0,\"109\":0,\"110\":0,\"111\":0,\"112\":0,\"113\":0,\"114\":0,\"115\":0,\"116\":0,\"117\":0,\"118\":0,\"119\":0}" }, "attackingPressureGraphs": [{ "inplayGraphId": 157, "matchId": 2190955, "statsId": 0, "teamId": 0, "graphTypeId": 5, "graphData": "{\"0\":0,\"1\":0,\"2\":0,\"3\":1,\"4\":4,\"5\":5,\"6\":6,\"7\":7,\"8\":7,\"9\":7,\"10\":7,\"11\":6,\"12\":6,\"13\":6,\"14\":5,\"15\":5,\"16\":3,\"17\":2,\"18\":1,\"19\":2,\"20\":2,\"21\":2,\"22\":2,\"23\":2,\"24\":2,\"25\":2,\"26\":1,\"27\":1,\"28\":2,\"29\":2,\"30\":1,\"31\":1,\"32\":1,\"33\":2,\"34\":2,\"35\":1,\"36\":1,\"37\":2,\"38\":2,\"39\":1,\"40\":2,\"41\":2,\"42\":3,\"43\":3,\"44\":2,\"45\":2,\"46\":3,\"47\":3,\"48\":4,\"49\":4,\"50\":4,\"51\":3,\"52\":4,\"53\":3,\"54\":3,\"55\":3,\"56\":3,\"57\":2,\"58\":2,\"59\":1,\"60\":1,\"61\":1,\"62\":1,\"63\":0,\"64\":0,\"65\":0,\"66\":0,\"67\":0,\"68\":0,\"69\":0,\"70\":0,\"71\":0,\"72\":0,\"73\":0,\"74\":0,\"75\":0,\"76\":0,\"77\":0,\"78\":0,\"79\":0,\"80\":0,\"81\":0,\"82\":0,\"83\":0,\"84\":0,\"85\":0,\"86\":0,\"87\":0,\"88\":0,\"89\":0,\"90\":0,\"91\":0,\"92\":0,\"93\":0,\"94\":0,\"95\":0,\"96\":0,\"97\":0,\"98\":0,\"99\":0,\"100\":0,\"101\":0,\"102\":0,\"103\":0,\"104\":0,\"105\":0,\"106\":0,\"107\":0,\"108\":0,\"109\":0,\"110\":0,\"111\":0,\"112\":0,\"113\":0,\"114\":0,\"115\":0,\"116\":0,\"117\":0,\"118\":0,\"119\":0}" }, { "inplayGraphId": 158, "matchId": 2190955, "statsId": 0, "teamId": 0, "graphTypeId": 4, "graphData": "{\"0\":0,\"1\":0,\"2\":0,\"3\":0,\"4\":0,\"5\":20,\"6\":20,\"7\":30,\"8\":30,\"9\":30,\"10\":30,\"11\":30,\"12\":30,\"13\":30,\"14\":30,\"15\":30,\"16\":10,\"17\":10,\"18\":0,\"19\":0,\"20\":0,\"21\":0,\"22\":0,\"23\":0,\"24\":0,\"25\":0,\"26\":0,\"27\":0,\"28\":10,\"29\":10,\"30\":10,\"31\":10,\"32\":10,\"33\":10,\"34\":10,\"35\":10,\"36\":10,\"37\":20,\"38\":20,\"39\":10,\"40\":10,\"41\":10,\"42\":10,\"43\":10,\"44\":10,\"45\":10,\"46\":10,\"47\":10,\"48\":0,\"49\":10,\"50\":10,\"51\":10,\"52\":10,\"53\":20,\"54\":20,\"55\":20,\"56\":20,\"57\":20,\"58\":20,\"59\":20,\"60\":10,\"61\":10,\"62\":10,\"63\":10,\"64\":0,\"65\":0,\"66\":0,\"67\":0,\"68\":0,\"69\":0,\"70\":0,\"71\":0,\"72\":0,\"73\":0,\"74\":0,\"75\":0,\"76\":0,\"77\":0,\"78\":0,\"79\":0,\"80\":0,\"81\":0,\"82\":0,\"83\":0,\"84\":0,\"85\":0,\"86\":0,\"87\":0,\"88\":0,\"89\":0,\"90\":0,\"91\":0,\"92\":0,\"93\":0,\"94\":0,\"95\":0,\"96\":0,\"97\":0,\"98\":0,\"99\":0,\"100\":0,\"101\":0,\"102\":0,\"103\":0,\"104\":0,\"105\":0,\"106\":0,\"107\":0,\"108\":0,\"109\":0,\"110\":0,\"111\":0,\"112\":0,\"113\":0,\"114\":0,\"115\":0,\"116\":0,\"117\":0,\"118\":0,\"119\":0}" }, { "inplayGraphId": 159, "matchId": 2190955, "statsId": 0, "teamId": 0, "graphTypeId": 3, "graphData": "{\"0\":0,\"1\":0,\"2\":0,\"3\":0,\"4\":0,\"5\":0,\"6\":0,\"7\":0,\"8\":0,\"9\":1,\"10\":1,\"11\":2,\"12\":3,\"13\":2,\"14\":3,\"15\":4,\"16\":4,\"17\":4,\"18\":7,\"19\":7,\"20\":7,\"21\":8,\"22\":8,\"23\":7,\"24\":8,\"25\":8,\"26\":8,\"27\":8,\"28\":9,\"29\":9,\"30\":9,\"31\":8,\"32\":8,\"33\":6,\"34\":6,\"35\":5,\"36\":5,\"37\":4,\"38\":5,\"39\":5,\"40\":5,\"41\":5,\"42\":5,\"43\":4,\"44\":3,\"45\":4,\"46\":4,\"47\":3,\"48\":3,\"49\":3,\"50\":5,\"51\":5,\"52\":5,\"53\":5,\"54\":6,\"55\":7,\"56\":7,\"57\":8,\"58\":9,\"59\":9,\"60\":8,\"61\":7,\"62\":7,\"63\":6,\"64\":6,\"65\":5,\"66\":4,\"67\":3,\"68\":0,\"69\":0,\"70\":0,\"71\":0,\"72\":0,\"73\":0,\"74\":0,\"75\":0,\"76\":0,\"77\":0,\"78\":0,\"79\":0,\"80\":0,\"81\":0,\"82\":0,\"83\":0,\"84\":0,\"85\":0,\"86\":0,\"87\":0,\"88\":0,\"89\":0,\"90\":0,\"91\":0,\"92\":0,\"93\":0,\"94\":0,\"95\":0,\"96\":0,\"97\":0,\"98\":0,\"99\":0,\"100\":0,\"101\":0,\"102\":0,\"103\":0,\"104\":0,\"105\":0,\"106\":0,\"107\":0,\"108\":0,\"109\":0,\"110\":0,\"111\":0,\"112\":0,\"113\":0,\"114\":0,\"115\":0,\"116\":0,\"117\":0,\"118\":0,\"119\":0}" }, { "inplayGraphId": 193, "matchId": 2190955, "statsId": 0, "teamId": 0, "graphTypeId": 2, "graphData": "{\"0\":0,\"1\":0,\"2\":0,\"3\":0,\"4\":0,\"5\":0,\"6\":0,\"7\":0,\"8\":0,\"9\":0,\"10\":0,\"11\":20,\"12\":20,\"13\":20,\"14\":20,\"15\":20,\"16\":30,\"17\":30,\"18\":30,\"19\":30,\"20\":30,\"21\":30,\"22\":20,\"23\":20,\"24\":20,\"25\":20,\"26\":20,\"27\":10,\"28\":10,\"29\":10,\"30\":20,\"31\":20,\"32\":20,\"33\":10,\"34\":20,\"35\":20,\"36\":20,\"37\":20,\"38\":20,\"39\":20,\"40\":20,\"41\":10,\"42\":10,\"43\":10,\"44\":10,\"45\":0,\"46\":0,\"47\":0,\"48\":0,\"49\":10,\"50\":20,\"51\":20,\"52\":30,\"53\":30,\"54\":30,\"55\":30,\"56\":30,\"57\":40,\"58\":50,\"59\":50,\"60\":40,\"61\":30,\"62\":30,\"63\":20,\"64\":20,\"65\":20,\"66\":20,\"67\":20,\"68\":10,\"69\":0,\"70\":0,\"71\":0,\"72\":0,\"73\":0,\"74\":0,\"75\":0,\"76\":0,\"77\":0,\"78\":0,\"79\":0,\"80\":0,\"81\":0,\"82\":0,\"83\":0,\"84\":0,\"85\":0,\"86\":0,\"87\":0,\"88\":0,\"89\":0,\"90\":0,\"91\":0,\"92\":0,\"93\":0,\"94\":0,\"95\":0,\"96\":0,\"97\":0,\"98\":0,\"99\":0,\"100\":0,\"101\":0,\"102\":0,\"103\":0,\"104\":0,\"105\":0,\"106\":0,\"107\":0,\"108\":0,\"109\":0,\"110\":0,\"111\":0,\"112\":0,\"113\":0,\"114\":0,\"115\":0,\"116\":0,\"117\":0,\"118\":0,\"119\":0}" }, { "inplayGraphId": 501, "matchId": 2190955, "statsId": 0, "teamId": 0, "graphTypeId": 2, "graphData": "{\"0\":0,\"1\":0,\"2\":0,\"3\":0,\"4\":0,\"5\":0,\"6\":0,\"7\":0,\"8\":0,\"9\":0,\"10\":0,\"11\":20,\"12\":20,\"13\":20,\"14\":20,\"15\":20,\"16\":30,\"17\":30,\"18\":30,\"19\":30,\"20\":30,\"21\":30,\"22\":20,\"23\":20,\"24\":20,\"25\":20,\"26\":20,\"27\":10,\"28\":10,\"29\":10,\"30\":20,\"31\":20,\"32\":20,\"33\":10,\"34\":20,\"35\":20,\"36\":20,\"37\":20,\"38\":20,\"39\":20,\"40\":20,\"41\":10,\"42\":10,\"43\":10,\"44\":10,\"45\":0,\"46\":0,\"47\":0,\"48\":0,\"49\":10,\"50\":20,\"51\":20,\"52\":30,\"53\":30,\"54\":30,\"55\":30,\"56\":30,\"57\":40,\"58\":50,\"59\":50,\"60\":40,\"61\":30,\"62\":30,\"63\":20,\"64\":20,\"65\":20,\"66\":20,\"67\":20,\"68\":10,\"69\":0,\"70\":0,\"71\":0,\"72\":0,\"73\":0,\"74\":0,\"75\":0,\"76\":0,\"77\":10,\"78\":10,\"79\":10,\"80\":10,\"81\":10,\"82\":10,\"83\":10,\"84\":10,\"85\":10,\"86\":10,\"87\":10,\"88\":0,\"89\":0,\"90\":0,\"91\":0,\"92\":0,\"93\":0,\"94\":0,\"95\":0,\"96\":0,\"97\":0,\"98\":0,\"99\":0,\"100\":0,\"101\":0,\"102\":0,\"103\":0,\"104\":0,\"105\":0,\"106\":0,\"107\":0,\"108\":0,\"109\":0,\"110\":0,\"111\":0,\"112\":0,\"113\":0,\"114\":0,\"115\":0,\"116\":0,\"117\":0,\"118\":0,\"119\":0}" }, { "inplayGraphId": 502, "matchId": 2190955, "statsId": 0, "teamId": 0, "graphTypeId": 3, "graphData": "{\"0\":0,\"1\":0,\"2\":0,\"3\":0,\"4\":0,\"5\":0,\"6\":0,\"7\":0,\"8\":0,\"9\":1,\"10\":1,\"11\":2,\"12\":3,\"13\":2,\"14\":3,\"15\":4,\"16\":4,\"17\":4,\"18\":7,\"19\":7,\"20\":7,\"21\":8,\"22\":8,\"23\":7,\"24\":8,\"25\":8,\"26\":8,\"27\":8,\"28\":9,\"29\":9,\"30\":9,\"31\":8,\"32\":8,\"33\":6,\"34\":6,\"35\":5,\"36\":5,\"37\":4,\"38\":5,\"39\":5,\"40\":5,\"41\":5,\"42\":5,\"43\":4,\"44\":3,\"45\":4,\"46\":4,\"47\":3,\"48\":3,\"49\":3,\"50\":5,\"51\":5,\"52\":5,\"53\":5,\"54\":6,\"55\":7,\"56\":7,\"57\":8,\"58\":9,\"59\":9,\"60\":8,\"61\":7,\"62\":7,\"63\":6,\"64\":7,\"65\":7,\"66\":6,\"67\":5,\"68\":4,\"69\":4,\"70\":4,\"71\":5,\"72\":5,\"73\":4,\"74\":5,\"75\":4,\"76\":1,\"77\":2,\"78\":2,\"79\":2,\"80\":1,\"81\":1,\"82\":0,\"83\":0,\"84\":0,\"85\":0,\"86\":1,\"87\":2,\"88\":1,\"89\":1,\"90\":1,\"91\":1,\"92\":1,\"93\":1,\"94\":1,\"95\":1,\"96\":0,\"97\":0,\"98\":0,\"99\":0,\"100\":0,\"101\":0,\"102\":0,\"103\":0,\"104\":0,\"105\":0,\"106\":0,\"107\":0,\"108\":0,\"109\":0,\"110\":0,\"111\":0,\"112\":0,\"113\":0,\"114\":0,\"115\":0,\"116\":0,\"117\":0,\"118\":0,\"119\":0}" }, { "inplayGraphId": 503, "matchId": 2190955, "statsId": 0, "teamId": 0, "graphTypeId": 4, "graphData": "{\"0\":0,\"1\":0,\"2\":0,\"3\":0,\"4\":0,\"5\":20,\"6\":20,\"7\":30,\"8\":30,\"9\":30,\"10\":30,\"11\":30,\"12\":30,\"13\":30,\"14\":30,\"15\":30,\"16\":10,\"17\":10,\"18\":0,\"19\":0,\"20\":0,\"21\":0,\"22\":0,\"23\":0,\"24\":0,\"25\":0,\"26\":0,\"27\":0,\"28\":10,\"29\":10,\"30\":10,\"31\":10,\"32\":10,\"33\":10,\"34\":10,\"35\":10,\"36\":10,\"37\":20,\"38\":20,\"39\":10,\"40\":10,\"41\":10,\"42\":10,\"43\":10,\"44\":10,\"45\":10,\"46\":10,\"47\":10,\"48\":0,\"49\":10,\"50\":10,\"51\":10,\"52\":10,\"53\":20,\"54\":20,\"55\":20,\"56\":20,\"57\":20,\"58\":20,\"59\":20,\"60\":10,\"61\":10,\"62\":10,\"63\":10,\"64\":0,\"65\":0,\"66\":0,\"67\":0,\"68\":0,\"69\":0,\"70\":0,\"71\":0,\"72\":0,\"73\":0,\"74\":0,\"75\":0,\"76\":0,\"77\":0,\"78\":0,\"79\":0,\"80\":0,\"81\":0,\"82\":0,\"83\":0,\"84\":0,\"85\":0,\"86\":0,\"87\":0,\"88\":0,\"89\":0,\"90\":0,\"91\":0,\"92\":0,\"93\":0,\"94\":0,\"95\":0,\"96\":0,\"97\":0,\"98\":0,\"99\":0,\"100\":0,\"101\":0,\"102\":0,\"103\":0,\"104\":0,\"105\":0,\"106\":0,\"107\":0,\"108\":0,\"109\":0,\"110\":0,\"111\":0,\"112\":0,\"113\":0,\"114\":0,\"115\":0,\"116\":0,\"117\":0,\"118\":0,\"119\":0}" }, { "inplayGraphId": 504, "matchId": 2190955, "statsId": 0, "teamId": 0, "graphTypeId": 5, "graphData": "{\"0\":0,\"1\":0,\"2\":0,\"3\":1,\"4\":4,\"5\":5,\"6\":6,\"7\":7,\"8\":7,\"9\":7,\"10\":7,\"11\":6,\"12\":6,\"13\":6,\"14\":5,\"15\":5,\"16\":3,\"17\":2,\"18\":1,\"19\":2,\"20\":2,\"21\":2,\"22\":2,\"23\":2,\"24\":2,\"25\":2,\"26\":1,\"27\":1,\"28\":2,\"29\":2,\"30\":1,\"31\":1,\"32\":1,\"33\":2,\"34\":2,\"35\":1,\"36\":1,\"37\":2,\"38\":2,\"39\":1,\"40\":2,\"41\":2,\"42\":3,\"43\":3,\"44\":2,\"45\":2,\"46\":3,\"47\":3,\"48\":4,\"49\":4,\"50\":4,\"51\":3,\"52\":4,\"53\":3,\"54\":3,\"55\":3,\"56\":3,\"57\":2,\"58\":2,\"59\":1,\"60\":1,\"61\":1,\"62\":1,\"63\":0,\"64\":0,\"65\":0,\"66\":1,\"67\":4,\"68\":5,\"69\":6,\"70\":5,\"71\":5,\"72\":5,\"73\":5,\"74\":5,\"75\":5,\"76\":5,\"77\":5,\"78\":4,\"79\":3,\"80\":2,\"81\":2,\"82\":1,\"83\":1,\"84\":1,\"85\":2,\"86\":2,\"87\":2,\"88\":0,\"89\":0,\"90\":0,\"91\":0,\"92\":0,\"93\":0,\"94\":0,\"95\":0,\"96\":0,\"97\":0,\"98\":0,\"99\":0,\"100\":0,\"101\":0,\"102\":0,\"103\":0,\"104\":0,\"105\":0,\"106\":0,\"107\":0,\"108\":0,\"109\":0,\"110\":0,\"111\":0,\"112\":0,\"113\":0,\"114\":0,\"115\":0,\"116\":0,\"117\":0,\"118\":0,\"119\":0}" }], "preMatchOdds": null, "h2hMatches": [], "homeHistoricalMatches": [], "awayHistoricalMatches": [], "homeImage": null, "awayImage": null, "homeForm": [], "awayForm": [{ "formId": 473, "teamId": 160122, "homeOrAway": "A", "kickOffTime": "2020-06-17T18:00:00", "matchResult": 1 }], "homeLast5": { "last5MinutesId": 61, "matchId": 2190955, "statsId": 0, "currentGameTime": "87", "shotsOnTarget": "0", "shotsOffTarget": "0", "corners": "0", "attacks": "3", "dangerousAttacks": "3", "goals": "0", "pressureIndex": "9", "teamId": 160121 }, "awayLast5": { "last5MinutesId": 62, "matchId": 2190955, "statsId": 0, "currentGameTime": "87", "shotsOnTarget": "0", "shotsOffTarget": "0", "corners": "0", "attacks": "3", "dangerousAttacks": "1", "goals": "0", "pressureIndex": "5", "teamId": 160122 }, "homeLast10": { "last10MinutesId": 122, "matchId": 2190955, "statsId": 0, "currentGameTime": "87", "shotsOnTarget": "0", "shotsOffTarget": "0", "corners": "0", "attacks": "3", "dangerousAttacks": "3", "goals": "0", "pressureIndex": "9", "teamId": 160121 }, "awayLast10": { "last10MinutesId": 91, "matchId": 2190955, "statsId": 0, "currentGameTime": "87", "shotsOnTarget": "0", "shotsOffTarget": "0", "corners": "0", "attacks": "3", "dangerousAttacks": "1", "goals": "0", "pressureIndex": "5", "teamId": 160122 }, "homeLast20": { "last20MinutesId": 122, "matchId": 2190955, "statsId": 0, "currentGameTime": "87", "shotsOnTarget": "0", "shotsOffTarget": "1", "corners": "0", "attacks": "9", "dangerousAttacks": "7", "goals": "0", "pressureIndex": "26", "teamId": 160121 }, "awayLast20": { "last20MinutesId": 91, "matchId": 2190955, "statsId": 0, "currentGameTime": "87", "shotsOnTarget": "0", "shotsOffTarget": "0", "corners": "1", "attacks": "7", "dangerousAttacks": "5", "goals": "0", "pressureIndex": "19", "teamId": 160122 } };

      // this.setResultVar([result]);
      this.setResultVar(data.matches);
    } else {
      this.service.getPlayResults().subscribe(response => {
        this.setResultVar(response['matches']);
      })
    }

    this.service.getPredictionsManagerResults().subscribe(response => {
      this.userPredictions = response['result']['userPredictions'];
      this.preHeight = this.userPredictions.length * 48;
    })

    this.messageService.removeGridEvent.subscribe(value => {
      if (value > -1 && this.grids.length) {
        this.grids.splice(value, 1);
      }
    })
  }
}
