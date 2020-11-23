import { Injectable } from '@angular/core';
import { LOCAL_STORAGE_KEY } from 'src/app/types';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  constructor() {}

  setItem(key: LOCAL_STORAGE_KEY, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: LOCAL_STORAGE_KEY): any {
    return JSON.parse(localStorage.getItem(key));
  }

  removeItem(key: LOCAL_STORAGE_KEY): void {
    localStorage.removeItem(key);
  }
}
