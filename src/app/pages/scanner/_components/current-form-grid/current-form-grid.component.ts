import { Component, OnInit, Input } from '@angular/core';
import { PlayService } from '../../play.service';
import {MessageService} from './../../message.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-current-form-grid',
  templateUrl: './current-form-grid.component.html',
  styleUrls: ['./current-form-grid.component.scss']
})
export class CurrentFormGridComponent implements OnInit {

  data = {homeId:null,awayId:null}

  initialized = false;
  homeId;
  awayId;

  @Input()
  type;

  matches = [];

  constructor(private service :PlayService,private messageService:MessageService , private route : ActivatedRoute) {
    this.homeId = this.route.snapshot.paramMap.get('homeId')
    this.awayId = this.route.snapshot.paramMap.get('homeId')

   }

  ngOnInit(): void {
    if(this.type=='Home'){
      this.data.homeId = this.homeId;
    } else if(this.type=='Away'){
      this.data.awayId = this.awayId;
    } else if(this.type=='H2H'){
      this.data.homeId = this.homeId;
      this.data.awayId = this.awayId;
    }

    this.service.getHistoricalMatches(this.data).subscribe(response=>{
      if(response['match']){
        if(this.type=='Home'){
          this.matches = response['match']['homeHistoricalMatches']
        } else if(this.type=='Away'){
          this.matches = response['match']['awayHistoricalMatches']
        } else if(this.type=='H2H'){
          this.matches = response['match']['homeHistoricalMatches'].
          concat(response['match']['awayHistoricalMatches']).filter(match=>match.h2H);
        }
      }
      this.messageService.formGridLoadEventChange(true);
      this.initialized = true;
    })
  }

  getTextClass(home,option){
    if(option && option.matchResult==1){
      return '';
    } else if (option && option.matchResult==0){
      return home? 'font-red' :'font-green';
    } else if (option && option.matchResult==2){
      return home? 'font-green' : 'font-red';
    }
  }

  getClass(option){
    if(option && option.matchResult==1){
      return 'btn btn-grey btn-circle right-10 bottom-5';
    } else if (option && option.matchResult==0){
      return 'btn btn-red btn-circle right-10 bottom-5' ;
    } else if (option && option.matchResult==2){
      return 'btn btn-green btn-circle right-10 bottom-5';
    }
  }

  isLight(){
    return environment.theme=='light'
  }

}
