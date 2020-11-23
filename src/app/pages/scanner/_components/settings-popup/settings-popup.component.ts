import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../../message.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-settings-popup',
  templateUrl: './settings-popup.component.html',
  styleUrls: ['./settings-popup.component.scss']
})
export class SettingsPopupComponent implements OnInit {

  @Input()
  modal;

  @Input()
  gridNumber;

  @Input()
  activeMainColumnVisibility = []

  @Input()
  activePreviousStatsColumnVisibility = [];

  @Input()
  activeMiscStatsColumnVisibility = []

  @Input()
  color;

  toggleColorPicker = false;

  constructor(private modalService: NgbModal, private messageService: MessageService) {}

  ngOnInit(){}

  getActiveColumnVisibility(){
    if(this.activeMainColumnVisibility && this.activeMainColumnVisibility.length){
      return this.activeMainColumnVisibility.filter(config=>config)
    }
    return this.activeMainColumnVisibility;
  }

  getActivePreviousStatsColumnVisibility(){
    if(this.activePreviousStatsColumnVisibility && this.activePreviousStatsColumnVisibility.length){
      return this.activePreviousStatsColumnVisibility.filter(config=>config)
    }
    return this.activePreviousStatsColumnVisibility;
  }

  getActiveMiscColumnVisibility(){
    if(this.activeMiscStatsColumnVisibility && this.activeMiscStatsColumnVisibility.length){
      return this.activeMiscStatsColumnVisibility.filter(config=>config)
    }
    return this.activeMiscStatsColumnVisibility;
  }

  toggle(entry){
    if(entry){
      entry.visible = !entry.visible;
      // this.publishToScoreGrid();
    }
  }

  publishToScoreGrid(){
    let publishData = {
      gridNumber:this.gridNumber,
      activeMiscStatsColumnVisibility:this.activeMiscStatsColumnVisibility,
      activePreviousStatsColumnVisibility:this.activePreviousStatsColumnVisibility,
      activeMainColumnVisibility:this.activeMainColumnVisibility
    }

    
    this.messageService.publishVisibilityToMainGrid(publishData);
    alert("Applied success!");
    this.modal.dismiss('asdf')
  }

  togglePicker(){
    this.toggleColorPicker = !this.toggleColorPicker;
  }

  applyColorToGrid(){
    let publishData = {
      gridNumber:this.gridNumber,
      color : this.color
    }
    this.messageService.applyColorToGrid(publishData);
  }

  getClass(visibility){
    if(this.isLight()){
      if(visibility){
        return 'btn btn-soccer-primary btn-lg top-5 bottom-10 right-10 rounded-style';
      } else{
        return 'btn btn-soccer-outline-primary btn-lg top-5 bottom-10 right-10 rounded-style';
      }
    } else{
      if(visibility){
        return 'btn btn-soccer-dark-primary btn-lg top-5 bottom-10 right-10 rounded-style';
      } else{
        return 'btn btn-soccer-dark-outline-primary btn-lg top-5 bottom-10 right-10 rounded-style';
      }
    }

  }

  deleteGrid(){
    this.messageService.removeGrid(this.gridNumber);
    this.modal.dismiss('Grid Detached')
  }

  isLight(){
    return environment.theme == 'light';
  }
}