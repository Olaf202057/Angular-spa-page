import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../../message.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-quick-filter-popup',
  templateUrl: './quick-filter-popup.component.html',
  styleUrls: ['./quick-filter-popup.component.scss']
})
export class QuickFilterPopupComponent implements OnInit {

  @Input()
  modal;

  @Input()
  gridNumber;

  @Input()
  gamesCurrentlyInFilters = []

  @Input()
  miscFilters = [];

  strategies = ['Example 1', 'Example 2', 'Example 3']

  constructor(private modalService: NgbModal, private messageService: MessageService) {}

  ngOnInit(){
  }

  getGamesCurrentlyInFilters(){
    if(this.gamesCurrentlyInFilters && this.gamesCurrentlyInFilters.length){
      return this.gamesCurrentlyInFilters.filter(config=>config)
    }
    return this.gamesCurrentlyInFilters;
  }

  getMiscFilters(){
    if(this.miscFilters && this.miscFilters.length){
      return this.miscFilters.filter(config=>config)
    }
    return this.miscFilters;
  }

  toggle(entry){
    console.log(entry);
    if(entry){
      entry.applyFilter = !entry.applyFilter;
      this.publishToScoreGrid();
    }
  }

  publishToScoreGrid(){
    let publishData = {
      gridNumber:this.gridNumber,
      miscFilters:this.miscFilters,
      gamesCurrentlyInFilters:this.gamesCurrentlyInFilters,
    }

    this.messageService.publishQuickFiltersToMainGrid(publishData);
  }

  getClass(visibility){
    if(this.isLight()){
      if(visibility){
        return 'btn btn-soccer-primary btn-lg top-5 bottom-10 right-10 rounded-style filter-button';
      } else{
        return 'btn btn-soccer-outline-primary btn-lg top-5 bottom-10 right-10 rounded-style filter-button';
      }
    } else{
      if(visibility){
        return 'btn btn-soccer-dark-primary btn-lg top-5 bottom-10 right-10 rounded-style filter-button';
      } else{
        return 'btn btn-soccer-dark-outline-primary btn-lg top-5 bottom-10 right-10 rounded-style filter-button';
      }
    }

  }

  isLight(){
    return environment.theme == 'light';
  }
}
