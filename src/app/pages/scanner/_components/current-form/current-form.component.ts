import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MessageService} from './../../message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-current-form',
  templateUrl: './current-form.component.html',
  styleUrls: ['./current-form.component.scss']
})
export class CurrentFormComponent implements OnInit,AfterViewInit {

  loaded = false;
  selectedOption = 'All'
  active = 1;
  type;


  constructor(private messageService:MessageService, private route:ActivatedRoute ) {
    this.type = this.route.snapshot.paramMap.get('type')

     this.messageService.formGridLoadEvent.subscribe(value=>{
       this.loaded = value;
     })
   }

   ngAfterViewInit(){

   }

  ngOnInit(): void {
    environment.headerWidth = "full"
  }

  selectOption(value){
    this.selectedOption = value;
    if(value=='Home'){
      this.active = 1;
    } else if(value=='Away'){
      this.active = 2;
    } else if(value=='All'){
      this.active = 1;
    }
  }

  isLight(){
    return environment.theme=='light'
  }

}
