import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public formGridLoadEvent : EventEmitter<boolean> = new EventEmitter();
  public publishVisibilityEvent: EventEmitter<any> = new EventEmitter();
  public publishQuickFiltersEvent: EventEmitter<any> = new EventEmitter();
  public removeGridEvent:EventEmitter<any> = new EventEmitter();
  public statsFilterEvent:EventEmitter<any> = new EventEmitter();
  public themeChangeEvent:EventEmitter<boolean> = new EventEmitter();
  public applyColorToGridEvent:EventEmitter<any> = new EventEmitter();
  constructor() { }

  formGridLoadEventChange(value){
    this.formGridLoadEvent.emit(value);
  }

  applyColorToGrid(value){
    this.applyColorToGridEvent.emit(value)
  }

  publishVisibilityToMainGrid(publishData){
    this.publishVisibilityEvent.emit(publishData);
  }

  removeGrid(value){
    this.removeGridEvent.emit(value);
  }

  applyStatsFilters(value){
    this.statsFilterEvent.emit(value);
  }

  publishQuickFiltersToMainGrid(data){
    this.publishQuickFiltersEvent.emit(data)
  }

  doChangeTheme(){
    this.themeChangeEvent.emit(true);
  }
}
